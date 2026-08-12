import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not-found">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link href="/" className="btn btn-primary">
        Back to Image Tools
      </Link>
    </div>
  );
}
