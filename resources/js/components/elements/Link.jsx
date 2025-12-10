import { Link as RouterLink } from "react-router";

export default function Link ({ children, bg, isActive, bgActive, hover, color, className, ...props }) {
  return (
    <RouterLink className={`${props.disabled ? 'opacity-50 cursor-not-allowed' : (hover ?? 'hover:bg-rise')} ${isActive ? (bgActive ??  'bg-digital-forest') : (bg ?? 'bg-primary')}  ${color ?? 'text-white'} text-center rounded-md py-2 px-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`} {...props}>
      {children}
    </RouterLink>
  );
}
