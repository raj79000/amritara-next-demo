import Image from 'next/image';
import Link from 'next/link';
import "../Styles/inner-hero.css"
import MainHeader from "../Common/MainHeader";
import { ChevronRight } from 'lucide-react';
import ContactUsMain from '../Components/ContactUsMain';


export const metadata = {
  title: 'Hotels and Resorts in India - Amritara Hotels',
  description: 'Amritara Hotels- A group of hotels with the best luxury and heritage hotels and resorts in India. Stay in the best accommodations with all the contemporary amenities. Book now.',
  alternates: {
    canonical: '/contact-us',
  },
};

export default function ContactPage() {
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
                <h2 className="inner-banner-heading">Contact Us</h2>
                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
    <section className="about-us-page section-padding">
        <div className="container">
            <div className='heading-style-1'>
                <h1 className="mb-4 text-center global-heading">Amritara Hotels & Resorts</h1>
                <span className='line-1'></span>
                <span className='line-2'></span>
            </div>
        </div>
        <ContactUsMain></ContactUsMain>
    </section>
    </>
  );
}