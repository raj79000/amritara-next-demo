"use client";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="not-found-page d-flex align-items-center justify-content-center vh-100 text-center flex-column">
      <Image
        // src="/error-404.png"
        src="/404.png"
        alt="404 Not Found"
        width={250}
        height={160}
        className="mb-4"
      />
      <h3 className="fw-bold mb-3"> Page Not Found</h3>
      <p className="text-muted mb-4">
        Oops! The page you're looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Back To The Homepage
      </Link>

      <style jsx>{`
        .not-found-page {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
