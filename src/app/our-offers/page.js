import Image from 'next/image';
import Link from 'next/link';
import "../Styles/inner-hero.css"
import MainHeader from "../Common/MainHeader";
import { ChevronRight } from 'lucide-react';
import OurOffers from './OurOffers';


export const metadata = {
  title: 'Hotels and Resorts in India - Amritara Hotels',
  description: 'Amritara Hotels- A group of hotels with the best luxury and heritage hotels and resorts in India. Stay in the best accommodations with all the contemporary amenities. Book now.',
  alternates: {
    canonical: '/our-offers',
  },
};

export default function OfferPage() {
  return (
    <>
    <OurOffers></OurOffers>
    {/* <MainHeader></MainHeader>
    <section className="hero-section-inner">
        <video autoPlay loop muted playsInline className="w-100 inner-hero-image" thumbnail="/img/banner-thumbnail.png"
            poster="/img/banner-thumbnail.png"
          >
            <source src="/img/amritara-new-banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div className="inner-hero-content">
            <div className="text-center">
                <h2 className="inner-banner-heading">Our Offers</h2>
                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Our Offers</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
    <section className="about-us-page section-padding">
        <div className="container">
            <div className='heading-style-1'>
                <h1 className="mb-4 text-center global-heading">Our Offers</h1>
            </div>
            <p className='text-center'>
               					We have thoughtfully curated a variety of offers for you to choose from. Each of our properties has numerous attractive deals to make your stay even more rewarding. Avail these exciting offers and make the most of your stay!
				     </p>
            
          <div className="row align-items-center">
              <div className="col-md-12">
                <OurOffers></OurOffers>
              </div>
          </div>
        </div>
    </section> */}


    </>
  );
}