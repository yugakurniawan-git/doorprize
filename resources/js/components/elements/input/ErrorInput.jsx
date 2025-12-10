export default function ErrorInput({ error }) {
  if (error && error.length > 1) {
    return (
      <ul>
        {error.map((item, index) => (
          <li key={index} className="text-xs text-red-500">
            {item}
          </li>
        ))}
      </ul>
    );
  } else {
    return <span className="text-xs text-red-500">{error}</span>;
  }
}
