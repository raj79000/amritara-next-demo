import Image from 'next/image';
import Link from 'next/link';
import "../Styles/inner-hero.css"
import MainHeader from "../Common/MainHeader";
import { ChevronRight } from 'lucide-react';
import Footer from '../Common/Footer';
export const metadata = {
    title: 'Terms and Conditions - Amritara Hotels & Resorts',
    description: 'View the Amritara Hotels & Resorts Terms and Conditions at our official site. Check out now.',
    alternates: {
        canonical: '/term-and-condition',
    },
};
export default function TandCPage() {
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
                        <h2 className="inner-banner-heading">TERMS & CONDITIONS</h2>
                        <nav aria-label="breadcrumb" className="banner-breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/">Home</Link><ChevronRight />
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">Terms & Conditions</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>
            <section className="privacy-policy-page section-padding">
                <div className="container">
                    <div className='heading-style-1'>
                        <h1 className="mb-4 text-center global-heading">TERMS AND CONDITIONS</h1>
                    </div>
                    <div className="row align-items-center mb-2">
                        <div className="col-md-12">
                            <h3>Information Security Practices and Controls</h3>
                            <p>Your credit or debit card information is NOT requested or stored on our servers. We direct you to the secured HDFC payment gateway to enter your credit/debit card information. Only successful and failure transaction information is stored on our server and no card details are stored on our server.</p>
                            <p>In order to avoid credit card frauds, guests are requested to note the following:</p>
                            <ul>
                                <li>In case the booking is made using credit card, guests are requested to carry the following documents at the time of check-in.</li>
                                <li>If the credit card holder is the guest or one of the guests, then the credit card will have to be produced at the time of check-in.</li>
                                <li>If the credit card holder is not one of the guests, then a copy of the credit card (both front and back), self-attested by the credit card holder should be produced at the time of check-in.</li>
                                <li>In addition to this, it is also required to produce a letter, signed by the credit card holder, authorizing the use of the credit card for the booking of the room. The letter should mention the names of the guests, date of travel, property and room type. This letter, along with the self-attested copy of the credit card will have to be submitted at check-in desk.</li>
                                <li>At the time of submitting the credit card copy, please ensure that the CVV number on it is blacked out. (CVV Number is a three-digit number at the reverse side of the credit card, at the end of the signature panel).</li>
                            </ul>
                            <p>In case the above documents are not produced by the guests, Hotel reserves the right to deny the reservation. In such case no refund (except for the taxes) will be given to the guest.</p>
                            <p>In case of erroneous / inadequate / misleading information given while booking, the hotel reserves the right to cancel the booking without any intimation.</p>
                            <p>Guests are required to carry a valid identity proof and produce the same at the time of check in.<br/>Please bring along with you the same identity proof you have entered while booking for verification at the hotel.</p>
                            <h3>Billing Information</h3>
                            <p>All online payments made through credit/debits will be debited from your account immediately in the name of AMRITARA HOTELS AND RESORTS PVT. LTD.</p>
                            <h3>Reservation Policy</h3>
                            <ul>
                                <li>All bookings would be confirmed subject to receipt of full advance payment.</li>
                                <li>Any changes in the Government taxes or surcharges that may be levied shall be applicable and will have to be paid.</li>
                            </ul>
                            <h3>Cancellation Policy</h3>
                            <ul>
                                <li>No cancellation fee will apply if the reservation is cancelled 30 (thirty) days prior to the date of arrival.</li>
                                <li>In case of cancellation bank charges will be applicable.</li>
                            </ul>
                            <p><strong>Hotel Alerts:</strong> As a Mandatory check-In Requirement all Foreign Nationals and Non-Residential Indians Need to present Passport/Visa and all Indian Nationals need to present Photo Identity Card with address Proof.</p>
                            <h3>Refund Policy</h3>
                            <ul>
                                <li>In case of refund, bank transactions will be deducted above cancellation charges.</li>
                                <li>In case of credit card transactions, refund will be done only to the same credit card. Refund process will take minimum of 15 days.</li>
                            </ul>
                            <h3>Disclaimer</h3>
                            <p><em><small>We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.</small></em></p>
                        </div>
                       
                    </div>
                    
                </div>
            </section>
        </>
    );
}