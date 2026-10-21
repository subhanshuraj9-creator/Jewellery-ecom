import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>This page is unavailable.</h1>
      <p>Browse the collection or return to the homepage.</p>
      <Link className="button button-dark" href="/collections">
        Explore the collection
      </Link>
    </main>
  );
}
