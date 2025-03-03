import { Link } from "@remix-run/react";

export function HitItem({ hit }: { hit: any }) {
  if (!hit?.hierarchy?.lvl1) return <p>Nothing</p>;
  return (
    <article className="flex flex-col">
      <Link to={hit.url}>
        <p>{hit.hierarchy.lvl1}</p>
      </Link>
    </article>
  );
}
