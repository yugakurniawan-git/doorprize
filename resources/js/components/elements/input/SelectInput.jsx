import { forwardRef } from "react";
import ErrorInput from "./ErrorInput";
import { AsyncPaginate } from "react-select-async-paginate";

const SelectInput = forwardRef(
  ({ error, className, params, setParams, label, required, value, onChange, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${className ?? ""}`}>
        <label htmlFor={props.name} className="text-sm text-slate-500">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <AsyncPaginate
          ref={ref}
          placeholder={`Select ${label}`}
          className={error && "ring-1 ring-red-500"}
          isClearable={true}
          isSearchable={false}
          value={
            value || (params && props.name && params[props.name]
              ? {
                value: params[props.name],
                label: props.options
                  ? props.options.find((option) => option.value === params[props.name])
                      ?.label || params[props.name]
                  : params[props.name],
              }
              : null)
          }
          onChange={(value) => {
            if (onChange) {
              onChange(value);
            } else if (setParams && params && props.name) {
              if (value?.value) {
                setParams({
                  ...params,
                  [props.name]: value.value,
                });
              } else {
                const { [props.name]: nameValue, ...rest } = params;
                setParams(rest);
              }
            }
          }}
          {...props}
        />
        <ErrorInput error={error} />
      </div>
    );
  }
);

export default SelectInput;
