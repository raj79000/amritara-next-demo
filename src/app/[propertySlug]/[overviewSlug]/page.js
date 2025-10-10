import ClientOverviewPage from "./ClientOverviewPage";
import { notFound } from "next/navigation";

const ALLOWED = new Set([
  "hotel-overview",
  "resort-overview",
  "property-overview", // fallback
]);

export default function OverviewPage({ params, searchParams }) {
  const { propertySlug, overviewSlug } = params || {};
  if (!ALLOWED.has(overviewSlug)) return notFound();

  const id = searchParams?.id ? Number(searchParams.id) : null;
  const name = searchParams?.name ?? null;

  return (
    <ClientOverviewPage
      propertySlug={propertySlug}
      propertyId={id}
      propertyName={name}
      overviewSlug={overviewSlug} // optional, in case you want type-specific UI
    />
  );
}
