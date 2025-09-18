import Image from 'next/image';
import Link from 'next/link';
import "../Styles/inner-hero.css"
import MainHeader from "../Common/MainHeader";
import { ChevronRight } from 'lucide-react';


export const metadata = {
  title: 'Hotels and Resorts in India - Amritara Hotels',
  description: 'Amritara Hotels- A group of hotels with the best luxury and heritage hotels and resorts in India. Stay in the best accommodations with all the contemporary amenities. Book now.',
  alternates: {
    canonical: '/about-us',
  },
};

export default function AboutPage() {
  return (
    <>
    <MainHeader></MainHeader>
    <section className="hero-section-inner">
        <video autoPlay loop muted playsInline className="w-100 inner-hero-image" thumbnail="/img/banner-thumbnail.png"
            poster="/img/banner-thumbnail.png"
          >
            <source src="/img/amritara-new-banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        {/* <Image src="/img/popular-1.jpeg" alt="About Us Hero Image" height={500} width={1500} className="w-100 inner-hero-image" /> */}
        <div className="inner-hero-content">
            <div className="text-center">
                <h2 className="inner-banner-heading">About Us</h2>
                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">About Us</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
    <section className="about-us-page section-padding">
        <div className="container">
            <div className='heading-style-1'>
                <h1 className="mb-4 text-center global-heading">ABOUT AMRITARA</h1>
            </div>
            

        <div className="row align-items-center mb-5">
            
            <div className="col-md-6 order-lg-2">
                <h4 className="h5 mb-3">At Amritara Hotels, we invite you on an extraordinary journey where every moment is crafted to perfection.</h4>
                <p className='text-justify'>
                    Experience the unparalleled hospitality of Amritara Hotels and Resorts, with 28 luxurious 
                    properties in all 4 zones spanning across 24 cities in 11 states, including Jammu & Kashmir, 
                    Punjab, Himachal Pradesh, Uttarakhand, Rajasthan, Sikkim, Kerala, Goa, Uttar Pradesh, 
                    and Karnataka.
                </p>
                <p className='text-justify'>
                    From the serene landscapes of the Himalayas to the vibrant beaches of Goa, 
                    each destination offers a unique journey, ensuring unforgettable stays and cherished memories.
                    Begin a new chapter in your journey with Amritara Hotels, where every stay is a gateway to
                    unforgettable experiences.
                </p>
           
            </div>
            <div className="col-md-6 ">
            <Image height={500} width={800}
                src="/img/amritara-about-img.jpg"
                alt="Luxury Stay"
                className="img-fluid rounded shadow-sm"
            />
            </div>
        </div>

        <div className="row align-items-center">
            
            <div className="col-md-6">
                <div className='heading-style-2'>
                    <h2 className="global-heading">Our Story</h2>
                </div>
                
                <p className='text-justify'>
                    &ldquo;Amritara&rdquo; derives its origins from Sanskrit. &lsquo;Amrit&rsquo; means  pure, the nectar of gods or holy water and &lsquo;Tara&rsquo; means stars or celestial bodies. Amritara promises an experience for the mature, adventurous traveller. Our leisure travel offerings are geared toward rejuvenating, real-life experiences for our guests.
                </p>
            </div>
            <div className="col-md-6">
            <Image height={500} width={800}
                src="/img/amritara-about-img.jpg"
                alt="Luxury Stay"
                className="img-fluid rounded shadow-sm"
            />
            </div>
        </div>
        </div>
    </section>

    </>
  );
}