import { fetchBlogList } from "../../lib/api/blogs";
import "../Styles/inner-hero.css"
import "../Styles/styleblog.css";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronsRight } from "lucide-react";
import ContactForm from "../Components/ContactForm";
import MainHeader from "../Common/MainHeader";
import Footer from "../Common/Footer";

const dummyImage = "/img/amritara-dummy.jpg";

function stripHtml(html) {
  if (!html) return "";

  // Decode a limited set of common HTML entities
  const entityMap = {
    '&nbsp;': ' ',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&mdash;': '—',
    '&ndash;': '–',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&lt;': '<',
    '&gt;': '>'
  };

  // Replace HTML entities with their character equivalents
  let decoded = html.replace(/&[a-zA-Z0-9#]+;/g, (match) => entityMap[match] || '');

  // Remove all HTML tags
  decoded = decoded.replace(/<[^>]+>/g, '');

  // Collapse multiple spaces, newlines, tabs, etc. into a single space
  return decoded.replace(/\s+/g, ' ').trim();
}

export async function generateMetadata() {
  return {
    title: "Amritara Hotels - Best Resorts in India - Official Website Blog",
    description: "Discover Travel Blogs at Amritara Hotels & Resort. Get to know about spectacular tourist attractions, restaurants & activities to do in India. Explore now.",
    openGraph: {
      title: "Amritara Hotels - Best Resorts in India - Official Website Blog",
      description: "Discover Travel Blogs at Amritara Hotels & Resort. Get to know about spectacular tourist attractions, restaurants & activities to do in India. Explore now.",
    },
    alternates: {
      canonical: "/blog",
    },
  };
}

export default async function BlogPage() {
  try {
    const blogs = await fetchBlogList();

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
        {/* <Image src="/img/popular-1.jpeg" alt="About Us Hero Image" height={500} width={1500} className="w-100 inner-hero-image" /> */}
        <div className="inner-hero-content">
            <div className="text-center">
                <h2 className="inner-banner-heading">Blogs</h2>
                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Blogs</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>

        <section className="blog-global-things">
          <div className="container">
            <div className="blog-list">
              <h1 className="m-3 inner-hd text-center">Amritara Hotels Blog</h1>
              <div className="row">
                <div className="col-lg-8">
                  <div className="row">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="col-md-6 mb-3">
                        <div className="blog-card-list">
                          <Image
                            src={blog.image_url || dummyImage}
                            height={350}
                            width={500}
                            alt={blog.title}
                            className="blog-list-image"
                          />
                          <div className="blog-list-content-box">
                            <Link
                              href={`blog/${blog.urlslug}`}
                              className="blog-list-title-link"
                            >
                              <h5 className="blog-list-title">{blog.title}</h5>
                            </Link>
                            {/* <p className="blog-category-and-date">{blog.post_date} - <i>{blog.category_name}</i></p> */}
                            <p className="blog-category-and-date">
                              {blog.post_date} -{" "}
                              <i>
                                <Link
                                  href={`blog/${blog.category_slug}`}
                                  className="blog-category-link"
                                >
                                  {blog.category_name}
                                </Link>
                              </i>
                            </p>

                            {/* <p dangerouslySetInnerHTML={{ __html: blog.description.slice(0, 150) + '...' }} className="blog-list-desc" /> */}

                            <p className="blog-list-desc">
                              {stripHtml(blog.description).slice(0, 130)}...
                            </p>
                            <Link
                              href={`blog/${blog.urlslug}`}
                              className="blog-list-link"
                            >
                              Read more
                            </Link>
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
                            <Link href={`blog/${blog.urlslug}`} className="blog-list-link">{blog.title}</Link>
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
  } catch (error) {
    return <div>Error fetching blogs: {error.message}</div>;
  }
}