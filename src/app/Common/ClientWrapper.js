"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
// import { createSignature } from "../../utilities/signature";
// import { BookingEngineProvider } from "../cin_context/BookingEngineContext";
import { useRouter } from "next/navigation";

const HomePage = dynamic(() => import("../../app/Components/Homepage/HomePage"), { ssr: false });

export default function ClientWrapper() {
  const searchParams = useSearchParams();
  const [tokenKey, setTokenKey] = useState(null);
  const [status, setStatus] = useState(null);
  const [contentData, setContentData] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (window.location.hash) {
      router.replace(window.location.pathname); 
    }
  }, [router]);
  useEffect(() => {
    const token = searchParams.get("tokenKey");
    const stat = searchParams.get("status");
    setTokenKey(token);
    setStatus(stat);
  }, [searchParams]);
  return (
    <HomePage contentData={contentData} tokenKey={tokenKey} status={status} />
  );
}
