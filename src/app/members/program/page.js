"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MainHeader from "@/app/Common/MainHeader";
import CommonMemberHeader from "../CommonMemberHeader";
import Image from "next/image";

export default function MemberProgramPage() {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <>
      <MainHeader />

      <section
        className="main-dashboard-page member-program-page-main-data"
        style={{ minHeight: "60vh", background: "#f8f6f2", paddingBottom: "50px" }}
      >
         <div className="atithyam-logo-div text-center">
                   <Image src="/rewards/atithyam_logo.png" className="atithyam-logo-dashboard" height={150} width={200} alt="atithyam logo" />
                 </div>
        <div className="container mt-4">

         

          {/* Top Navigation */}
          <div className="members-main-top-nav mb-4">
            <CommonMemberHeader />

            <div className="member-data-box-main mt-4 program-member-data-box">
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                <h1
                  className="text-center mb-3"
                  style={{ fontFamily: "'Times New Roman', serif", color: "#5C2E12" }}
                >
                  Atithyam: The Exclusive Loyalty Program by Amritara Hotels and Resorts
                </h1>
                <p className="text-center" style={{ fontSize: "0.95rem" }}>
                  Welcome to Atithyam, a thoughtfully crafted loyalty program designed to elevate the guest experience at Amritara Hotels and Resorts.
                  Rooted in the philosophy of Indian hospitality and the tradition of treating guests as gods 
                  (<strong>Atithi Devo Bhava</strong>), Atithyam is a testament to our commitment to enriching your journey with us.
                </p>
              </div>

              {/* Why Atithyam */}
              <div
                className="card shadow-sm border-0 rounded-4 p-4 mb-4 d-flex flex-column flex-md-row align-items-start"
                style={{ gap: "20px" }}
              >
                <Image
                  src="/rewards/atithyam_logo.png"
                  height={100}
                  width={150}
                  alt="Atithyam Logo"
                  className="atithyam-logo-on-program"
                />
                <div>
                  <h5 className="mb-2">Why Atithyam?</h5>
                  <p>
                    The idea behind Atithyam stems from our desire to express gratitude to our cherished guests and to deepen the bond we share.
                    It is more than a loyalty program—it is an exclusive invitation to a world of personalized experiences, privileges, and rewards.
                    Whether you’re embarking on your first Amritara getaway or are a seasoned guest, Atithyam enhances your journey.
                  </p>

                  {showMore && (
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>
                        <span><strong>Aarambh – The Beginning</strong></span>
                        <p>
                          Perfect for new explorers, the Aarambh tier offers you access to the foundational benefits of Atithyam.
                          From exclusive offers to curated recommendations, this is your starting point for memorable experiences.
                        </p>
                      </li>
                      <li>
                        <span><strong>Swarna – The Golden Path</strong></span>
                        <p>
                          As you deepen your connection with Amritara, the Swarna tier opens the door to enriched privileges, including enhanced rewards,
                          priority services, and bespoke offerings to make your journey even more exceptional.
                        </p>
                      </li>
                      <li>
                        <span><strong>Amrit – The Ultimate Indulgence</strong></span>
                        <p>
                          The pinnacle of the Atithyam experience, the Amrit tier is for our most valued guests. Enjoy unparalleled benefits, priority upgrades,
                          personalized services, and indulgences crafted just for you.
                        </p>
                      </li>
                    </ul>
                  )}

                  <button
                    className="btn btn-brown mt-2"
                    onClick={handleToggle}
                  >
                    {showMore ? "READ LESS" : "READ MORE"}
                  </button>
                </div>
              </div>

              {/* What Makes Atithyam Special */}
              <div
                className="card shadow-sm border-0 rounded-4 p-4 mb-4 d-flex flex-row align-items-center"
                style={{ gap: "20px" }}
              >
                <Image
                  src="/rewards/to-receive-points-svgrepo-com.svg"
                  height={100}
                  width={150}
                  alt="Rewards Icon"
                  className="reward-hand-point-icon"
                />
                <div>
                  <h5 className="mb-2">What Makes Atithyam Special?</h5>
                  <ul style={{ paddingLeft: "20px" }}>
                    <li><strong>Exclusive Rewards:</strong> Earn and redeem points seamlessly during your stays, dining experiences, and special events at any Amritara property.</li>
                    <li><strong>Personalized Experiences:</strong> Enjoy bespoke services tailored to your preferences, ensuring every visit feels like coming home.</li>
                    <li><strong>Unforgettable Moments:</strong> Through partnerships, special offers, and curated experiences, Atithyam celebrates you in every way possible.</li>
                  </ul>
                </div>
              </div>

              {/* Join the Journey Section */}
              <div className="text-center p-4 mt-4 rounded-4 m-text-white" style={{ backgroundColor: "#5C2E12", color: "#fff" }}>
                <h4>Join the Journey</h4>
                <p>
                  <strong>Atithyam is not just about loyalty;</strong> it is a celebration of your journey with Amritara Hotels and Resorts.
                  From serene escapes to luxurious indulgences, let us redefine the way you experience hospitality.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
