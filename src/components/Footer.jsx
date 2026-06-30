import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-green-900 text-white px-6 py-4 text-sm">
      <div className="flex justify-between items-center">
        <p>© {new Date().getFullYear()} GreenMap</p>
        <Link to="/cookie-policy" className="hover:underline">
          Cookie Policy
        </Link>
      </div>
    </footer>
  );
}

export default Footer;