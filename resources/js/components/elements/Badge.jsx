export default function Badge({ children, className, ...props }) {
  return (
    <span
      className={`py-1 px-2 text-xs text-nowrap rounded-lg ${className ?? ''}`}
      {...props}
    >
      {children}
    </span>
  );

}
