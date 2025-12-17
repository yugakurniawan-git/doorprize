import { forwardRef, useContext } from 'react';
import ErrorInput from './ErrorInput';
import { DarkModeContext } from '../../../context/DarkMode';

const TextInput = forwardRef(({ label, required, error, className, classNameInput, ...props }, ref) => {
  const {isDarkMode} = useContext(DarkModeContext);
	return (
		<div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <label htmlFor={props.name} className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-500'}`}>
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				ref={ref}
				{...props}
				className={`
          ${isDarkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-white text-slate-900 placeholder-slate-500'}
          h-[38px] px-3 border-0 text-sm rounded
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
