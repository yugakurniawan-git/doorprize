import { AsyncPaginate } from "react-select-async-paginate";
import { apiService } from "../../../services/api.services";
import { forwardRef, useState } from "react";
import ErrorInput from "./ErrorInput";

const SelectAsyncPaginate = forwardRef(({ params, loadOptions, label, required, showLabel = true, url, className, error, ...props }, ref) => {
  const [cacheUniq, setCacheUniq] = useState(Date.now());

	const getOptions = async (searchQuery, _, { page }) => {
		const response = await apiService("GET", url, {
			params: {
				q: searchQuery,
				page: page,
				...params,
			},
		});
		return {
			options: response.data.data,
			hasMore: response.data.next_page_url ? true : false,
			additional: {
				page: page + 1 ,
			},
		};
	};

	return (
		<div className={`flex flex-col gap-1 ${className ?? ''}`}>
      {showLabel && (
        <label htmlFor={props.name} className="text-sm text-slate-500">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
			<AsyncPaginate
				selectRef={ref}
				className={`${ error && "ring-1 ring-red-500 rounded border-none" }`}
				placeholder={`Select ${label}`}
        debounceTimeout={300}
				loadOptions={loadOptions || getOptions}
        cacheUniqs={[cacheUniq]}
        onMenuOpen={() => setCacheUniq(Date.now())}
        isClearable={true}
				additional={{ page: 1 }}
				{...props}
			/>
			<ErrorInput error={error} />
		</div>
	);
});

export default SelectAsyncPaginate;
