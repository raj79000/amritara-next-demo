// Menu.js
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link"; // If not using Next.js, replace with <a>

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const liRefs = useRef([]);
  const selectorRef = useRef(null);

  const items = [
    { label: "My Account", href: "/members/dashboard" },
    { label: "Edit Profile", href: "/members/profile" },
    { label: "About the Program", href: "/members/program" },
    { label: "Program Benefits", href: "/members/program-benefits" },
    { label: "My Stays", href: "/members/my-stays" },
    { label: "Missing Stays", href: "/members/missing-stays" },
    { label: "Support", href: "/members/support" },
  ];

  // Set active based on current URL
  useEffect(() => {
    try {
      let path = window.location.pathname;
      const idx = items.findIndex((it) => it.href === path);
      if (idx >= 0) setActiveIndex(idx);
    } catch {}
  }, []);

  const moveSelector = () => {
    const sel = selectorRef.current;
    const li = liRefs.current[activeIndex];
    if (!sel || !li) return;

    sel.style.top = `${li.offsetTop}px`;
    sel.style.left = `${li.offsetLeft}px`;
    sel.style.height = `${li.offsetHeight}px`;
    sel.style.width = `${li.offsetWidth}px`;
  };

  useLayoutEffect(() => {
    moveSelector();
  }, [activeIndex]);

  useEffect(() => {
    const onResize = () => window.requestAnimationFrame(moveSelector);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <ul className="am-menu-list">
      {/* selector highlight */}
      <div className="hori-selector" ref={selectorRef}>
        <div className="left" />
        <div className="right" />
      </div>

      {items.map((item, idx) => (
        <li
          key={item.label}
          className={`am-menu${activeIndex === idx ? " active" : ""}`}
          ref={(el) => (liRefs.current[idx] = el)}
          onClick={() => setActiveIndex(idx)}
        >
          <Link
            className={`am-link${activeIndex === idx ? " am-active" : ""}`}
            href={item.href}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
