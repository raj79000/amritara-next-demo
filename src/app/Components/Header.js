"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

import "../Styles/header.css";
import "../Styles/globals.css";
import "../Styles/style.css";

export default function Header({ onSubmit }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [showFilterBar, setShowFilterBar] = useState(false);

  const [tokenKey, setTokenKey] = useState(null);
  const [status, setStatus] = useState(null);
  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    setHasMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!hasMounted) return null;

  const handleBookNow = (prop) => {
    // const label = cityName;
    // const value = cityId;
    // const property_Id = propertyId;
    //setCityDetails({ label, value, property_Id });
    setShowFilterBar(prop);
    onSubmit();
    //setPropertyId(propertyId);
  };
  return (
    <>
      <header className="corporate-header" id="corporate-header">
        <Sidebar
          isOpen={menuOpen || pathname === "/"}
          setIsOpen={setMenuOpen}
          forceOpen={pathname === "/"}
        />

        <nav
          className={`navbar navbar-expand-lg fixed-top ${
            isScrolled ? "navbar-scroll bg-white shadow-sm" : ""
          }`}
        >
          <div className="container-fluid">
            <Link href="/" className="logoimg logo-for-mobile">
              <Image
                src="/images/clarks-logo-black.png"
                alt="Logo"
                width={180}
                height={30}
                fetchPriority="high"
              />
            </Link>
            <button
              className="navbar-toggler d-md-none"
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-controls="navbarNav"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
              id="navbarNav"
            >
              {/* Close button for mobile */}
              <div className="d-md-none w-100 text-end pe-3 mt-2">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="btn-close"
                  aria-label="Close"
                  style={{
                    fontSize: "1.5rem",
                    background: "none",
                    border: "none",
                    color: "#000",
                  }}
                >
                  ✕
                </button>
              </div>

              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link" href="/hotels">
                    Our Hotels
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/ourbrands">
                    Our Brands
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/clarks-offers">
                    Clarks Offers
                  </Link>
                </li>
                <Link href="/" className="logoimg logo-for-desktop">
                  <Image
                    src="/images/clarks-logo-black.png"
                    alt="Logo"
                    width={180}
                    height={30}
                    fetchPriority="high"
                  />
                </Link>
                <li className="nav-item">
                  <Link className="nav-link" href="/brand-association">
                    Brand Association
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/contact-us">
                    Contact Us
                  </Link>
                </li>
                <li className="nav-item last-nav-item">
                  <a
                    href="#"
                    className="box-btn know-more p-2 desktop-book-now-header"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBookNow(!showFilterBar);
                    }}
                  >
                    Book Now
                  </a>
                  {/* <button
                    className="box-btn know-more p-2"
                    onClick={() => handleBookNow(!showFilterBar)}
                  >
                    Book Now
                  </button> */}
                </li>
              </ul>
            </div>
            <button className="box-btn know-more p-2 mobile-book-now-header"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBookNow(!showFilterBar);
                    }}
                  >
                    Book Now
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
