export default function Button ({ children, bg, isActive, bgActive, hover, color, className, ...props }) {
  return (
    <button
      className={`${props.disabled ? 'opacity-50 cursor-not-allowed' : (hover ?? 'hover:bg-rise cursor-pointer')} ${isActive ? (bgActive ??  'bg-digital-forest') : (bg ?? 'bg-primary')} ${color ?? 'text-white'} rounded-md py-2 px-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      disabled={props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
