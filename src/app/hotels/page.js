
import HotelsPageClient from './HotelsPageClient';

export const metadata = {
  title: "Hotels and Resorts in India - Amritara Hotels",
  description:
    "Amritara Hotels - A group of hotels with the best luxury and heritage hotels and resorts in India. Stay in the best accommodations with all the contemporary amenities. Book now.",
  alternates: {
    canonical: "/hotels",
  },
};

export default function HotelsPage() {
  return <HotelsPageClient />;
}
