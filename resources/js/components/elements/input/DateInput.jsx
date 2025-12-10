import { forwardRef } from "react";
import ErrorInput from "./ErrorInput";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  width,
} from "@fortawesome/free-solid-svg-icons/faCalendar";

const DateInput = forwardRef(
  ({ label, error, className, required, selected_date = new Date(), ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${className ?? ""}`}>
        {label?.length > 0 && (
          <label htmlFor={props.name} className="text-sm text-slate-500">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative ">
          <DatePicker
            ref={ref}
            selected={selected_date}
            dateFormat="MMMM d, yyyy"
            className={`w-full h-[38px] bg-white px-3 border-0 text-sm rounded-sm cursor-pointer`}
            wrapperClassName={`w-full transition duration-200 ease-in-out rounded-sm ring-1 ring-gray-300 focus:ring-1 focus:outline-none focus:ring-gray-300 ${
              error && "ring-1 ring-red-500"
            }`}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        </div>
        <ErrorInput error={error} />
      </div>
    );
  }
);

export default DateInput;
