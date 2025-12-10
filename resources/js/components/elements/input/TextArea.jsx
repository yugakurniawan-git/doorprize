import { forwardRef } from 'react';
import ErrorInput from './ErrorInput';
import { useRef, useEffect } from 'react';

const TextArea = forwardRef(({ label, error, className, required, classNameInput, ...props }, ref) => {
  const internalRef = useRef();
  const combinedRef = ref || internalRef;

  useEffect(() => {
    const textarea = combinedRef.current;
    if (textarea) {
      const resize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      };
      resize();
      textarea.addEventListener('input', resize);
      return () => textarea.removeEventListener('input', resize);
    }
  }, [combinedRef]);

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <label htmlFor={props.name} className="text-sm text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        ref={combinedRef}
        {...props}
        className={`
          min-h-[76px] border-0 text-sm rounded bg-white
          transition duration-200 ease-in-out
          ring-1 ring-gray-300 focus:ring-1 focus:outline-none focus:ring-gray-300 px-3 py-2
          ${ error && "ring-1 ring-red-500" }
          ${classNameInput ?? ''}
        `}
        style={{ overflow: 'hidden', resize: 'none' }}
      />
      <ErrorInput error={error} />
    </div>
  );
});

export default TextArea;
