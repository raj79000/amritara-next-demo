import MainHeader from "../Common/MainHeader";
import AtithyamClient from "./AtithyamClient";


export const metadata = {
  title: 'Atithyam - Exclusive Rewards and Privileges | Best Hotel Membership Program India',
  description: 'Unlock rewarding experiences with Amritara Hotels in India. Discover exclusive perks and benefits that enhance your stay with us.',
  alternates: {
    canonical: '/rewards',
  },
};

export default function Rewards() {
  return (
    <>
    <MainHeader></MainHeader>

    {/* <section className="about-us-page section-padding">
        <div className="container">
            <div className='heading-style-1'>
                <h1 className="mb-4 text-center global-heading">Amritara Hotels & Resorts</h1>
                <span className='line-1'></span>
                <span className='line-2'></span>
            </div>
        </div>
    </section> */}
    <section className="rewards-page section-padding" style={{backgroundColor: '#f3efec'}}>
        <div className="container-fluid">

           <AtithyamClient />
            
        </div>
    </section>
    </>
  );
}