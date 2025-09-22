import React from "react";
import ExperienceClient from "./ExperienceClient";

export default async function ExperiencePage({ params }) {
 const resolvedParams = await params;
  const { brand_slug, propertyId } = resolvedParams;

  return (
    <>

    <ExperienceClient propertyId={propertyId} brand_slug={brand_slug}></ExperienceClient>
      
    </>
  );
}
