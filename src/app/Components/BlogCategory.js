
import Image from "next/image";
import ContactForm from "./ContactForm";
import Link from "next/link";
import "../Styles/inner-hero.css"
import "../Styles/styleblog.css";
import MainHeader from "../Common/MainHeader";
import { ChevronRight, ChevronsRight } from "lucide-react";
import Footer from "../Common/Footer";

// Define dummy image fallback here as well for consistency
const dummyImage = "/alivaa-dummy-image.png"; // Make sure this path is correct

function stripHtml(html) {
  if (!html) return "";

  // Basic HTML entity decoding
  const entityMap = {
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&mdash;': '—',
    '&ndash;': '–',
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };

  // Replace known entities
  let decoded = html.replace(/&[a-zA-Z0-9#]+;/g, (match) => entityMap[match] || '');

  // Remove HTML tags
  decoded = decoded.replace(/<[^>]+>/g, "");

  // Replace special punctuation with space
  decoded = decoded.replace(/['’“”—]/g, " ");

  // Normalize spaces
  return decoded.replace(/\s+/g, " ").trim();
}

export default function BlogCategory({ slug, blogs }) {
  // It's good practice to add a defensive check here as well,
  // although your SlugPage should prevent `blogs` from being empty.
  if (!blogs || blogs.length === 0) {
    return <div>No blogs found for this category.</div>;
  }

  return (
    <>
    <MainHeader></MainHeader>
    <section className="hero-section-inner">
       <video autoPlay loop muted playsInline className="w-100 inner-hero-image" thumbnail="/img/banner-thumbnail.png"
            poster="/img/banner-thumbnail.png"
          >
            <source src="/img/amritara-new-banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        {/* <Image src="/img/popular-1.jpeg" alt={`Category - ${slug}`} height={500} width={1500} className="w-100 inner-hero-image" /> */}
        <div className="inner-hero-content">
            <div className="text-center">
                <h2 className="inner-banner-heading">Blogs</h2>
                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/blog">Blog</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Blog Category</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>

   

      <section className="blog-global-things">
        <div className="container">
          <div className="blog-list">
            <h1 className="m-3 inner-hd text-center">Blog Category</h1>
            {/* You might want a title for the category here, e.g., <h1 className="m-3 inner-hd text-center">Category: {slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1> */}
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="col-md-6 mb-3">
                      <div className="blog-card-list">
                        <Image
                          // *** FIX HERE: Add fallback for image_url ***
                          src={blog.image_url || dummyImage}
                          height={350}
                          width={500}
                          alt={blog.title || 'Blog Post Image'} // Add fallback for alt text too
                          className="blog-list-image"
                        />
                        <div className="blog-list-content-box">
                          <Link href={`/blog/${blog.urlslug}`} className="blog-list-title-link">
                            <h5 className="blog-list-title">{blog.title || 'Untitled Blog'}</h5> {/* Add fallback for title */}
                          </Link>
                          <p className="blog-category-and-date">
                            {blog.post_date || 'Unknown Date'} - <i>{blog.category_name || 'Uncategorized'}</i> {/* Add fallbacks */}
                          </p>
                          <p className="blog-list-desc">
                            {stripHtml(blog.description || '').slice(0, 120)}... {/* Add fallback for description */}
                          </p>
                          <Link href={`/blog/${blog.urlslug}`} className="blog-list-link">Read more</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="blog-list-sidebar-box-fixed">
                  <ContactForm />
                  <div className="blog-list-sidebar">
                    <ul className="blog-list-sidebar-ul">
                      {blogs.map((blog) => (
                        <li key={blog.id} className="blog-list-sidebar-li">
                          <ChevronsRight></ChevronsRight>
                          <Link href={`/blog/${blog.urlslug}`} className="blog-list-link">
                            {blog.title || 'Untitled Blog'} {/* Add fallback for title */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}