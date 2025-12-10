import { forwardRef } from 'react';
import ErrorInput from './ErrorInput';

const FileInput = forwardRef(({ label, error, className, required, classNameInput, ...props }, ref) => {
    return (
        <div className={`flex flex-col gap-1 ${className ?? ''}`}>
            <label htmlFor={props.name} className="text-sm text-slate-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              ref={ref}
              type="file"
              {...props}
              className={`
                h-[38px] text-sm rounded bg-white
                transition duration-200 ease-in-out
                ring-1 ring-gray-300 focus:ring-1 focus:outline-none focus:ring-gray-300
                file:mr-4 file:py-2.5 file:px-3
                file:rounded file:border-0
                file:text-sm file:font-medium
                file:bg-gray-100 file:text-gray-700
                hover:file:bg-gray-200
                hover:cursor-pointer
                ${ error && "ring-1 ring-red-500" }
                ${classNameInput ?? ''}
              `}
            />
            <ErrorInput error={error} />
        </div>
    );
});

FileInput.displayName = 'FileInput';

export default FileInput;
