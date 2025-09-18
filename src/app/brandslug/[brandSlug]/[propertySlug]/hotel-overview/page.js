// app/[brand_slug]/overview/[id]/page.js
import ClientOverviewPage from "./ClientOverviewPage";

export default function Page({ params }) {
  const { propertySlug, id } = params;

  return <ClientOverviewPage brand_slug={propertySlug} id={id} />;
}
