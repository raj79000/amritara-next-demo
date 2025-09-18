'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setOpen(prev => !prev);
  const closeSidebar = () => setOpen(false);

  return (
    <>
      {/* ☰ Toggle Button */}
      <button
        className="clarks-sidebar-toggler"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <span />
        <span />
        <span />
      </button>

      {/* 🔲 Overlay */}
      {open && (
        <div className="clarks-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* 📑 Sidebar */}
      <div
        className={clsx("clarks-sidebar", {
          open,
          "clarks-sidebar-scrolled": isScrolled,
        })}
      >
        {/* ✖️ Close Button */}
        <div className="clarks-sidebar-header">
          <button
            className="clarks-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* 📄 Menu */}
        <ul className="clarks-sidebar-menu">
          <li><Link href="/hotels" onClick={closeSidebar}>Our Hotels</Link></li>
          <li><Link href="/ourbrands" onClick={closeSidebar}>Our Brands</Link></li>
          <li><Link href="/brand-association" onClick={closeSidebar}>Brand Association</Link></li>
          {/* <li>
            <Link href="/" onClick={closeSidebar}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={305}
                height={50}
                priority
              />
            </Link>
          </li> */}
          <li><Link href="/clarks-offers" onClick={closeSidebar}>Clarks Offers</Link></li>
          <li><Link href="/contact-us" onClick={closeSidebar}>Contact Us</Link></li>
          {/* <li>
            <a href="#" className="box-btn know-more p-2" onClick={closeSidebar}>Book Now</a>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
