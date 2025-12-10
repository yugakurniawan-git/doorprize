import { Link } from "react-router";

function Footer() {
  return (
    <footer className="mt-auto text-xs text-gray-400 text-center text-wrap">
      &copy; {new Date().getFullYear()}{" "}
      <Link
        to="https://manohara-asri.com"
        target="_blank"
        className="text-primary hover:text-rise duration-200 ease-in-out"
      >
        PT. Manohara Asri
      </Link>
    </footer>
  );
}

export default Footer;
