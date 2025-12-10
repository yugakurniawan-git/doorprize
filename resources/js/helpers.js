import moment from "moment";
import Swal from "sweetalert2";
import en from '../lang/en.json';

export function lang(text) {
  if (text === null || text === undefined) return text;
  Object.keys(en).forEach(key => {
    text = text.replace(new RegExp(key, 'g'), en[key]);
  });
  return text;
}

export function storage_url(url) {
	if (!url) return null;
	if (url.startsWith("/")) url = url.substring(1);
	// url = encodeURIComponent(url);
	return `${import.meta.env.VITE_AWS_ENDPOINT}/${
		import.meta.env.VITE_AWS_BUCKET
	}/${url}`;
}

export function api_url(url) {
	if (url.startsWith("/")) url = url.substring(1);
  return `${import.meta.env.VITE_API_URL}/${url}`;
}

export function base_url(url) {
	if (url.startsWith("/")) url = url.substring(1);
	return `${import.meta.env.VITE_BASE_URL}/${url}`;
}

export function no(response, iteration) {
	if (response.current_page && response.current_page !== "all") {
		return (response.current_page - 1) * response.per_page + iteration;
	}
	return iteration;
}

export function rawMessageDisplay(message) {
	message = message.replace(/(https?:\/\/[^\s]+)/g, '<a class="underline text-blue-600 break-all" href="$1" target="_blank">$1</a>');
	message = message.replace(/(?:\*)(.*?)(?:\*)/g, '<b>$1</b>');
	message = message.replace(/(?:\_)(.*?)(?:\_)/g, '<em>$1</em>');
	message = message.replace(/(?:~)(.*?)(?:~)/g, '<del>$1</del>');
	message = message.replace(/(?:```)(.*?)(?:```)/g, '<code>$1</code>');
	message = message.replace(/(?:`)(.*?)(?:`)/g, '<code>$1</code>');
	message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
	return message;
}

export function formattedTime(time) {
  return moment.unix(time).calendar(null, {
    sameDay: '[Today], HH:mm',
    lastDay: '[Yesterday], HH:mm',
    lastWeek: 'dddd, HH:mm',
    sameElse: 'MMMM Do YYYY, HH:mm'
  });
}

export const Toast = Swal.mixin({
	toast: true,
	position: "top-end",
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
  showCloseButton: true,
	didOpen: (toast) => {
		toast.addEventListener("mouseenter", Swal.stopTimer);
		toast.addEventListener("mouseleave", Swal.resumeTimer);
	},
});

const fallbackCopyText = (text, title) => {
	const textarea = document.createElement("textarea");
	textarea.value = text;
	document.body.appendChild(textarea);
	textarea.select();
	try {
		document.execCommand("copy");
		Toast.fire({
			icon: 'success',
			title: `${title} copied to clipboard`
		});
	} catch (err) {
		console.error("Fallback: Oops, unable to copy", err);
		Toast.fire({
			icon: 'error',
			title: `Failed to copy ${title} to clipboard`
		});
	}
	document.body.removeChild(textarea);
};

export const handleCopy = async (copiedText, title) => {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		try {
			await navigator.clipboard.writeText(copiedText);
			Toast.fire({
				icon: 'success',
				title: `${title} copied to clipboard`
			});
		} catch (err) {
			fallbackCopyText(copiedText, title);
		}
	} else {
		fallbackCopyText(copiedText, title);
	}
};
