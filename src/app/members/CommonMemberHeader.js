"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const CommonMemberHeader = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: "/members/dashboard", label: "My Account" },
    { href: "/members/profile", label: "Edit Profile" },
    { href: "/members/program", label: "About the Program" },
    { href: "/rewards", label: "Program Benefits" },
    { href: "/members/my-stays", label: "My Stays" },
    { href: "/members/missing-stays", label: "Missing Stays" },
    { href: "/members/support", label: "Support" },
  ];

  return (
    <div className="right_col">
      <ul className="top-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href; // exact match
          return (
            <li key={item.href} className="am-menu">
              <Link
                href={item.href}
                className={`am-link ${isActive ? "am-active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CommonMemberHeader;
