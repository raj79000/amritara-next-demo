"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./nested-slider.css";
import { Diamond, IndianRupee } from "lucide-react";

const dummyData = [
  {
    title: "Mountain Adventures",
    description: "Explore breathtaking mountain landscapes and thrilling hiking trails.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        text: "Majestic Mountain",
        image: "/img/popular-1.jpeg",
      },
      {
        text: "Majestic Mountain",
        image: "/img/popular-4.jpg",
      },
      {
        text: "Majestic Mountain",
        image: "/img/popular-3.jpg",
      },
      
    ],
  },
  {
    title: "Tropical Beaches",
    description: "Relax on pristine sandy beaches with crystal clear waters.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        text: "Majestic Mountain",
        image: "/img/popular-3.jpg",
      },
      {
        text: "Majestic Mountain",
        image: "/img/popular-1.jpeg",
      },
      
      {
        text: "Majestic Mountain",
        image: "/img/popular-4.jpg",
      },
    ],
  },
  {
    title: "Cultural Cities",
    description: "Discover the rich history and vibrant culture of world cities.",
    image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1200&q=80",
    items: [
      
      {
        text: "Majestic Mountain",
        image: "/img/popular-3.jpg",
      },
      {
        text: "Majestic Mountain",
        image: "/img/popular-4.jpg",
      },
      {
        text: "Majestic Mountain",
        image: "/img/popular-1.jpeg",
      },
    ],
  },
  {
    title: "Forest Retreats",
    description: "Immerse yourself in the tranquility of lush forest environments.",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        text: "Raje Mountain",
        image: "/img/popular-1.jpeg",
      },
      {
        text: "Majes Mountain",
        image: "/img/popular-3.jpg",
      },
      {
        text: "Majesticcc Mountain",
        image: "/img/popular-4.jpg",
      },
    ],
  },
  {
    title: "Rathore Adventures",
    description: "Experience the mystique and beauty of desert landscapes.",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        text: "Majestic Mountain",
        image: "/img/popular-1.jpeg",
      },
      {
        text: "Majestic Mountain",
        image: "/img/popular-3.jpg",
      },
      {
        text: "Majestic Mountain",
        image: "/img/popular-4.jpg",
      },
    ],
  },
];

export default function NestedSwiper() {
  const [parentSwiper, setParentSwiper] = useState(null);
  const parentPrevRef = useRef(null);
  const parentNextRef = useRef(null);

  useEffect(() => {
    if (parentSwiper) {
      parentSwiper.params.navigation.prevEl = parentPrevRef.current;
      parentSwiper.params.navigation.nextEl = parentNextRef.current;
      parentSwiper.navigation.init();
      parentSwiper.navigation.update();
    }
  }, [parentSwiper]);

  return (
    <div className="main-nested-slider mx-auto our-collection-section section-padding">
        
        <div className="container">
        <h3 className="main-section-title global-heading">Our Collection</h3>
            <div className="parent-control-button p-prev-button">
                <button ref={parentPrevRef} className="p-3 bg-gray-800 text-white rounded-full shadow-lg">
                ❮
                </button>
            </div>
            <div className="parent-control-button p-next-button">
                <button ref={parentNextRef} className="p-3 bg-gray-800 text-white rounded-full shadow-lg">
                ❯
                </button>
            </div>

            <Swiper
                pagination={{ clickable: true }}
                loop={true}
                modules={[Navigation]}
                onSwiper={setParentSwiper}
                spaceBetween={20}
                slidesPerView={1.5}
                centeredSlides={false}
                breakpoints={{
                640: { slidesPerView: 1.3 },
                768: { slidesPerView: 1.3 },
                1024: { slidesPerView: 1.3 },
                }}
                className="parent-swiper main-parent-slider"
            >
                {dummyData.map((slide, index) => (
                <SwiperSlide key={index} className=" bg-gray-100 rounded-xl relative">
                    <h3 className="text-2xl font-bold mb-3 d-none">{slide.title}</h3>
                   
                    <p className="text-gray-600 mb-4 d-none">{slide.description}</p>

                    <Swiper
                    pagination={{ clickable: true }}
                    navigation={true}
                    loop={true}
                    modules={[ Navigation]}
                    spaceBetween={10}
                    slidesPerView={1}
                    breakpoints={{ 
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 1 },
                    }}
                    className="child-swiper main-child-slider"
                    >
                    {slide.items.map((item, idx) => (
                        <SwiperSlide key={`${index}-${idx}`} className="child-slider-rel">
                        <Image
                        height={600} width={600}
                            src={item.image}
                            alt={item.text}
                            className="w-full h-36 object-cover rounded-md mb-2 child-image w-100"
                        />
                        <div className="child-slider-content">
                            <h3 className="child-sl-title">{item.title}</h3>
                            <div className="child-slider-content-btm">
                              <div className="child-slider-content-btm-left">
                                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                   Lorem Ipsum has been the industry.</p> */}
                                   <h3 className="child-sl-title">{item.text}</h3>
                                <button className="child-sl-btn mt-2">Book a Trip</button>
                              </div>

                              <div className="child-slider-content-btm-right">
                                  <div className="child-slider-content-btm-right-left">
                                    <p className="child-sl-price"><b> Book a day trip</b> <span>to go golden grass</span></p>
                                    <p className="child-sl-price"><b>  500</b> one day</p>
                                    {/* <p className="child-sl-price"><b> Book a weekend trip</b> explore twice</p> */}
                                  </div>
                                  <div className="child-slider-content-btm-right-right">
                                    <p className="child-sl-price"><b>  500</b> one day</p>
                                    <p className="child-sl-price"><b> 2,000</b> two day</p>
                                  </div>
                              </div>
                              
                            </div>
                        </div>
                        </SwiperSlide>
                    ))}
                    </Swiper>
                </SwiperSlide>
                ))}
            </Swiper>
        </div>
    </div>
  );
}
