"use client";
import "../Styles/HeaderStyle.css";
import Link from 'next/link';
import Image from "next/image";
import { useEffect, useState } from 'react';
import { Tally2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MainHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
    <header className="header-section">
      <nav className={`navbar navbar-expand-lg navbar-light ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-display-flex">
            <Link className="navbar-brand" href="/">
            <Image src="/img/logo.png" className="header-logo" alt="Amritara Hotels And Resorts" width={300} height={200} />
          </Link>
          
          <div className="navbarnav" id="navbarNav">
            {/* <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            </ul> */}
            <div className="display-flex">
              {isLoggedIn ? (
                <>
                  <Link className="me-3 header-btnn-top profile-menu-header" href="/profile">
                    Update Profile
                  </Link>
                  <Link className="me-3 header-btnn-top logout-menu-header" href="/logout">
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link className="me-3 header-btnn-top login-menu-header" href="/signin">
                    Login/Join
                  </Link>
                </>
              )}
              <Link className="me-3 header-btnn-top book-menu-header" href="/">
                Book Now
              </Link>
              <button onClick={toggleSidebar} className="sidebar-toggle border-0 bg-transparent ms-3">
                {/* <Image src="/img/menu.png" alt="alt" width={30} height={30} className="toggle-image-s" /> */}
                {/* <Menu  /> */}
                <Tally2 size={20} className="toggle-image-s" />
              </button>
              
            </div>
          </div>
          </div>
        </div>
      </nav>

      <div className={`sidebar-menu ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button onClick={toggleSidebar} className="close-btn">
            <X color="black" size={24} />
          </button>
        </div>
        <div className="sidebar-content">
          <ul className="sidebar-nav">
            <li><Link href="/" onClick={toggleSidebar}>Home</Link></li>
            <li><Link href="/hotels" onClick={toggleSidebar}>Our Hotels</Link></li>
            <li><Link href="/our-offers" onClick={toggleSidebar}>Our Offers</Link></li>
            <li><Link href="/about-us" onClick={toggleSidebar}>About Us</Link></li>
            <li><Link href="/rewards" onClick={toggleSidebar}>Rewards</Link></li>
            <li><Link href="/contact-us" onClick={toggleSidebar}>Contact Us</Link></li>
          </ul>
        </div>
      </div>
</header>
    
    </>
  );
};

export default MainHeader;
