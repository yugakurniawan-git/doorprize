import { forwardRef } from 'react';
import ErrorInput from './ErrorInput';

const TextInput = forwardRef(({ label, required, error, className, classNameInput, ...props }, ref) => {
	return (
		<div className={`flex flex-col gap-1 ${className ?? ''}`}>
			<label htmlFor={props.name} className="text-sm text-slate-500">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				ref={ref}
				{...props}
				className={`
          h-[38px] px-3 border-0 text-sm rounded bg-white
          transition duration-200 ease-in-out
          ring-1 ring-gray-300 focus:ring-1 focus:outline-none focus:ring-gray-300
          ${ error && "ring-1 ring-red-500" }
          ${classNameInput ?? ''}
        `}
			/>
			<ErrorInput error={error} />
		</div>
	);
});

export default TextInput;
