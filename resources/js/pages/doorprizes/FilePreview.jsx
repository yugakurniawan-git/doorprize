import { useState, useEffect } from "react";

function FilePreview({ file, index, onRemove }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [file]);

  if (!imageUrl) {
    return (
      <div className="relative">
        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
        <button
          type="button"
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 duration-200 ease-in-out cursor-pointer"
          onClick={onRemove}
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <a href={imageUrl} data-fancybox="gallery">
        <img
          src={imageUrl}
          className="w-full h-32 object-cover rounded hover:opacity-80 duration-200 ease-in-out cursor-pointer"
          alt={`Preview ${index}`}
        />
      </a>
      <button
        type="button"
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 duration-200 ease-in-out cursor-pointer"
        onClick={onRemove}
      >
        &times;
      </button>
    </div>
  );
}

export default FilePreview;
