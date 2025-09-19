
import Footer from "@/app/Common/Footer";
import dynamic from "next/dynamic";

const MainHeader = dynamic(() => import("../../Common/MainHeader"));
const BannerSec = dynamic(() => import("./BannerSec"));
const AboutSec = dynamic(() => import("./AboutSec"));
const NestedSwiper = dynamic(() => import("./NestedSlider"));
const NewOfferSlider = dynamic(() => import("./NewOfferSlider"));
const ZonesList = dynamic(() => import("./ZonesList"));
const UntoldStories = dynamic(() => import("./UntoldStories"));

const HomePage = () => {
  return (
    <>

      <MainHeader></MainHeader>
      <BannerSec></BannerSec>
      <AboutSec></AboutSec>
      <NestedSwiper></NestedSwiper>
      <UntoldStories></UntoldStories>
      <ZonesList></ZonesList>
      <NewOfferSlider></NewOfferSlider>

    </>
  )
}

export default HomePage
