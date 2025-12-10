export default function Badge({ children, className, bg, color, ...props }) {
  return (
    <span
      className={`py-1 px-2 text-xs text-nowrap rounded-lg ${className ?? ''}`}
      style={{
        backgroundColor: bg ?? '#6c757d',
        color: color ?? 'white'
      }}
      {...props}
    >
      {children}
    </span>
  );

}
