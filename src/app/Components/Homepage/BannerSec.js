import React from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

const BannerSec = async () => {
 
  return (
    <section className="hero-section position-relative vh-100 overflow-hidden h-full flex items-center justify-center">
      {/* <div className="video-background position-absolute w-100 h-100">
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          
          {vimeoSrc ? (
            <iframe
              src={vimeoSrc}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo Video"
            ></iframe>
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              Video is not available
            </div>
          )}
        </div>
      </div> */}
      <video className="w-100 h-[102vh] object-cover for-desktop-video-main"
      autoPlay
            muted
            loop
            playsInline
            preload="auto">
        <source src="/amritara-new-banner-video.mp4" type="video/mp4" />
      </video>
      {/* <video src="/amritara-new-banner-video.mp4" autoPlay loop ></video> */}
      <div className="hero-bottom-part-ab">
        <Link href="#" className="search-icon-banner">
          <Search />
        </Link>
      </div>
    </section>
  )
}

export default BannerSec
