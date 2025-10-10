import ClientOverviewPage from "./ClientOverviewPage";

export default function OverviewPage({ params, searchParams }) {
  const { propertySlug } = params;
  const { id, name } = searchParams || {};

  return (
    <ClientOverviewPage
      propertySlug={propertySlug}
      propertyId={id ? Number(id) : null}
      propertyName={name || null}
    />
  );
}
