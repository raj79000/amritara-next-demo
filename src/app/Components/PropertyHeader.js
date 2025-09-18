"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import "../Styles/header.css";
import "../Styles/globals.css";
import "../Styles/style.css";
import { ChevronDown } from "lucide-react";

export default function PropertyHeader({ onSubmit }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { brandSlug, propertySlug } = useParams(); 
  const [showFilterBar, setShowFilterBar] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!hasMounted) return null;

  const handleBookNow = (prop) => {
    setShowFilterBar(prop);
    onSubmit();
  }

  return (
    <header className="property-header-main">
      <nav
        className={`navbar navbar-expand-md navbar-light fixed-top ${
          isScrolled ? "navbar-scroll bg-white shadow-sm" : ""
        }`}
      >
        <div className="container-fluid">
          <Link href="/" className="logoimg logo-for-mobile">
              <Image
                src="/img/amritara-footer-logo.png"
                alt="Logo"
                width={60}
                height={50}
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

          <button  className="box-btn know-more p-2 property-header-book-now-mob" onClick={(e) => {
                      e.preventDefault();
                      handleBookNow(!showFilterBar);
                    }}
                  >
                    Book Now
                  </button>
          <div
            className={`collapse navbar-collapse justify-content-center ${
              menuOpen ? "show" : ""
            }`}
            id="navbarNav"
          >
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

            <div className="mx-auto d-flex flex-column flex-md-row align-items-center">
              <ul className="navbar-nav ml5">

                <li className="nav-item only-for-mob-menu-item">
                  <Link
                    className="nav-link"
                    href="/"
                  >
                    Home
                  </Link>
                </li>

                <li className="nav-item only-for-mob-menu-item">
                  <Link
                    className="nav-link"
                    href="/hotels"
                  >
                    Hotels
                    <ChevronDown size={12} className="d-inline-block ms-2"></ChevronDown>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href={`/${brandSlug}/${propertySlug}/hotel-overview`}
                  >
                    Overview
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href={`/${brandSlug}/${propertySlug}/hotel-rooms`}
                  >
                    Rooms
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href={`/${brandSlug}/${propertySlug}/restaurants`}
                  >
                    Dining
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href={`/${brandSlug}/${propertySlug}/meeting-events`}
                  >
                    Meetings & Events
                  </Link>
                </li>

                <li className="nav-item mx-4 property-logo-desktop">
                  <Link href="/" className="logoimg">
                    <Image
                      src="/img/amritara-footer-logo.png"
                      alt="Logo"
                      width={60}
                      height={60}
                      fetchPriority="high"
                    />
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href={`/${brandSlug}/${propertySlug}/hotel-offers`}
                  >
                    Offers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href={`/${brandSlug}/${propertySlug}/hotel-gallery`}
                  >
                    Gallery
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href={`/${brandSlug}/${propertySlug}/hotel-contact`}
                  >
                    Contact Us
                  </Link>
                </li>
                <li className="nav-item ms-5 property-book-now-header">
                  <a
                    href="#"
                    className="box-btn know-more p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBookNow(!showFilterBar);
                    }}
                  >
                    Book Now
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
