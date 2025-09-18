import Image from 'next/image';
import Link from 'next/link';
import "../Styles/inner-hero.css"
import MainHeader from "../Common/MainHeader";
import { ChevronRight } from 'lucide-react';
import Footer from '../Common/Footer';
export const metadata = {
    title: 'Privacy - Amritara Hotels & Resorts',
    description: 'View the Amritara Hotels & Resorts privacy policy for internet information at our official site. Amritara Hotels & Resorts is committed to respecting customers concerns regarding privacy. Check out now',
    alternates: {
        canonical: '/privacy-policy',
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
                        <h2 className="inner-banner-heading">Privacy Policy</h2>
                        <nav aria-label="breadcrumb" className="banner-breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/">Home</Link><ChevronRight />
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">Privacy Policy</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>
            <section className="privacy-policy-page section-padding">
                <div className="container">
                    <div className='heading-style-1'>
                        <h1 className="mb-4 text-center global-heading">Privacy Policy</h1>
                    </div>
                    <div className="row align-items-center mb-2">
                        <div className="col-md-12">
                            <h4>{"At Amritara Hotels & Resorts Pvt. Ltd"}</h4>
                            <p>{" (referred to as AH&R henceforth) we endeavour to provide our guests outstanding services and experiences in our hotels and luxury resorts around the world. We value your business and your faith in us in delivering you a superior level of service."}</p> 
                            <p>{" We recognise that privacy is important to our guests, and hence AH&R's Global Privacy Policy explains our practices regarding personal information we collect when you visit our hotels, restaurants, bars, our website, when you fill up a form and become member of our loyalty programmes."}</p>
                            <p>{" We request you to read this policy document carefully before sharing personal information with us. By visiting our web sites, we assume, your acceptance to the practices described in this policy document."}</p>

                            <h4>{"This policy document covers the following areas relating to privacy of information provided by you:"}</h4>
                            <ul>
                                <li>{"Personal information collected by AH&R from its guests"}</li>
                                <li>{"How does AH&R use the personal information collected from its guests"}</li>
                                <li>{"How does AH&R share the personal information collected from its guests, including with third parties"}</li>
                                <li>{"Non personal information collected by AH&R"}</li>
                                <li>{"Links to websites of third party marketers"}</li>
                                <li>{"AH&R's policy regarding protection of its guests' personal information"}</li>
                                <li>{"How long does AH&R retain your personal information"}</li>
                                <li>{"Should you want to opt out"}</li>
                                <li>{"Dos & Don't to ensure your security"}</li>
                                <li>{"Policy Modifications"}</li>
                                <li>{"Get in touch for any clarifications"}</li>
                            </ul>

                            <h4>{"Personal information collected by AH&R from its guests"}</h4>
                            <p>{" There are a number of situations in which your personal information may be gathered by AH&R to serve you better. At various touch points with our guests, we may collect the following personal information including, but not limited to: your name and contact information; date of birth; how you prefer to be addressed in communication from AH&R, preferred modes of communication; your job designation and business address; spouse name, anniversary, credit card details, including the three-digit code that appears on the back of your credit card; member number of our loyalty programmes, membership numbers of frequent flyer or travel partner programmes you are enrolled into, your dates of arrival and departure from our hotels/restaurants/other outlets, your preferences when you stay or dine at AH&R, your transaction history at AH&R; offers you have availed of from third party marketers in response to communication from AH&R. We may also record details on guests who have stayed or dined with you at AH&R, including their names and contact details."}</p>

                            <h4>{"Besides the above, we may also collect the following:"}</h4>
                            <ul>
                                <li>{"When you fill out a form (online or hard copy), stating your preferences when you stay or dine at AH&R. Such information may include details relating to health matters."}</li>
                                <li>{"User name and password selected by you when you register at our website or become a member of our loyalty programmes at our website."}</li>
                                <li>{"When you enrol in our loyalty programmes online we collect your personal information and record your membership number and password."}</li>
                                <li>{"If you choose to reserve a room online we record your arrival and departure dates, number of guests in the group, details of guest rooms and tariff details."}</li>
                                <li>{"When you make a request for a proposal from our meeting planners, by visiting our websites."}</li>
                                <li>{"When you contact us with your questions or comments."}</li>
                                <li>{"From time to time, our website may offer a feature that allows you to send an electronic postcard or otherwise share a message with a friend. To fulfil your request, AH&R may require personal information about the person to whom you are sending an electronic postcard or message, including name and email address, along with the text of any message you choose to include. Using this feature is tantamount to entitling us to store and use the recipient's name and email address."}</li>
                            </ul>

                            <p>{" We do not knowingly collect personal information from individuals under 18 years of age. As a parent or legal guardian, please do not to allow your children to submit personal information without your permission."}</p>
                            <p>{" We do not knowingly collect information related to your racial or ethnic origin, political opinions, religious or other beliefs, health, criminal background or political affiliations, unless it is volunteered by you. We may use any health-related information provided by you only to serve you better and meet your specific needs when you stay or dine with AH&R."}</p>

                            <h4>{"During your Visit, the web operating system will record :"}</h4>
                            <p>{" \"When you voluntarily send us electronic mail / fill up the form, we will keep a record of this information so that we can respond to you. We only collect information from you when you register on our site or fill out a form. Also, when filling out a form on our site, you may be asked to enter your: name, e-mail address or phone number. You may, however, visit our site anonymously. In case you have submitted your personal information and contact details, we reserve the rights to Call, SMS, Email or WhatsApp about our products and offers, even if your number has DND activated on it.\""}</p>

                            
                            <h4>{"How does AH&R use the personal information collected from its guests"}</h4>
                            <p>{" Your privacy is of utmost importance to us and we take it very seriously. We do not sell or rent your contact information to other marketers. We use your personal information to provide you with the services you request from AH&R, to help you make room reservations, to provide you with information about conferences and events at AH&R, to send you promotional material on Amritara services by email, direct mail and phone, to conduct surveys from time to time, to make you offers sourced from third parties, per your stated preferences or usage pattern exhibited at AH&R."}</p>

                            <h4>{"How does AH&R share the personal information"}</h4>
                            <p>{" Within the AH&R Group: As a global company, to ensure that you enjoy the same level of service across all our Hotels and luxury residences, owned or operated around the world, we may share your personal information with hotels within AH&R Group around the world. While doing so, AH&R will ensure that your personal information is handled and safeguarded as per this policy."}</p>

                            <h4>{"Should you want to opt out"}</h4>
                            <p>{" If we possess your contact information, we may want to keep you posted about our products, services and events, through email. Should you prefer not to keep up to date with AH&R news and latest information on services and receive such marketing materials, please send an email to unsubscribe@amritara.co.in"}</p>
                            <p>{" We will update your preferences as soon as reasonably practical. However, do note, if you opt out of AH&R emailing list, as described here, we will not be able to remove your personal information from the databases of affiliates, franchisees or business partners with which we have already shared your personal information, prior to the date of your opt-out request."}</p>

                            <h4>{"Dos & Don't to ensure your security"}</h4>
                            <ul>
                                <li>{"For your own privacy we advise you not to include sensitive personal information in any emails you may send to us. Please do not send credit card numbers or any sensitive personal information to us via email."}</li>
                                <li>{"We do not knowingly collect personal information from individuals under 18 years of age. As a parent or legal guardian, please do not to allow your children to submit personal information without your permission."}</li>
                            </ul>
                            <h4>{"Policy Modifications"}</h4>
                            <p>{" AH&R may update its privacy policy from time to time without prior notice and posted on the website."}</p>

                            <h4>{"Get in touch for any clarifications"}</h4>
                            <p>{" If you have any questions or concerns about this policy, please get in touch with us at privacy@amritara.co.in"}</p>
                        </div>
                    </div>
                </div>
                
            </section>

            <Footer></Footer>
        </>
    );
}