"use client";

import "../Styles/HeaderStyle.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tally2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MainHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const isLoggedIn = !!user;

  // Scroll event for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <header className="header-section">
        <nav
          className={`navbar navbar-expand-lg navbar-light ${
            isScrolled ? "scrolled" : ""
          }`}
        >
          <div className="container">
            <div className="header-display-flex">
              {/* Logo */}
              <Link className="navbar-brand" href="/">
                <Image
                  src="/img/logo.png"
                  className="header-logo"
                  alt="Amritara Hotels And Resorts"
                  width={300}
                  height={200}
                />
              </Link>

              <div className="navbarnav" id="navbarNav">
                <div className="display-flex">
                  {isLoggedIn ? (
                    <>
                      <div className="dropdown dropdown-for-logged-in-user">
                        <button
                          className="dropdown-toggle profile-btnn-top border-0 bg-transparent me-2"
                          type="button"
                          onClick={() => setOpen(!open)}
                          aria-expanded={open}
                        >
                          {user?.FirstName ? user.FirstName : "MY ACCOUNT"}
                        </button>
                        <ul className={`dropdown-menu ${open ? "show" : ""}`}>
                          <li>
                            <Link className="dropdown-item" href="/members/dashboard">
                             Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/logout">
                              Logout
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        className="me-3 header-btnn-top login-menu-header"
                        href="/signin"
                      >
                        Login/Join
                      </Link>
                    </>
                  )}

                  <Link
                    className="me-3 header-btnn-top book-menu-header"
                    href="/"
                  >
                    Book Now
                  </Link>

                  {/* Sidebar Toggle */}
                  <button
                    onClick={toggleSidebar}
                    className="sidebar-toggle border-0 bg-transparent ms-3"
                  >
                    <Tally2 size={20} className="toggle-image-s" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <div className={`sidebar-menu ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <button onClick={toggleSidebar} className="close-btn">
              <X color="black" size={24} />
            </button>
          </div>
          <div className="sidebar-content">
            <ul className="sidebar-nav">
              <li>
                <Link href="/" onClick={toggleSidebar}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/hotels" onClick={toggleSidebar}>
                  Our Hotels
                </Link>
              </li>
              <li>
                <Link href="/our-offers" onClick={toggleSidebar}>
                  Our Offers
                </Link>
              </li>
              <li>
                <Link href="/about-us" onClick={toggleSidebar}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/rewards" onClick={toggleSidebar}>
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/contact-us" onClick={toggleSidebar}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
