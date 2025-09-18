
import Image from "next/image";
import ContactForm from "./ContactForm";
import Link from "next/link";
import "../Styles/inner-hero.css"
import "../Styles/styleblog.css";
import MainHeader from "../Common/MainHeader";
import { ChevronRight, ChevronsRight } from "lucide-react";

export default function BlogDetail({ blog, relatedBlogs }) {
  return (
    <>
    <MainHeader></MainHeader>

        <section className="hero-section-inner">
       <Image src={blog.image_url} alt={blog.title} height={500} width={1500} className="w-100 inner-hero-image" />
        <div className="inner-hero-content">
            <div className="text-center">
                <h2 className="inner-banner-heading">Blog Detail</h2>
                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/blog">Blog</Link><ChevronRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Blog Detail</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
     

      <section className="blog-global-things">
        <div className="container">
          <h1 className="m-3 inner-hd text-center text-capitalize">{blog.title}</h1>
          <div className="blog-detail-page">
            <div className="row">
              <div className="col-lg-8">
                <div className="blog-detail">
                  <Image src={blog.image_url} alt={blog.title} width={800} height={400} className="w-100" />
                  <h2 className="blog-detail-main-title">{blog.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: blog.description }} className="blog-detail-description" />
                </div>

                {relatedBlogs && relatedBlogs.length > 0 && (
                  <div className="blog-related-post mt-5">
                    <h3 className="blog-related-post-title inner-hd text-center text-uppercase">Related Posts</h3>
                    <div className="row blog-related-post-list mt-4">
                      {relatedBlogs.map((item) => (
                        <div key={item.id} className="col-md-4">
                          <div className="blog-related-post-list-item">
                            <Link href={`/blog/${item.urlslug}`} className="blog-related-post-list-item-link">
                              <Image src={item.image_url} alt={item.title} width={500} height={300} className="w-100" />
                              <h6>{item.title}</h6>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="col-lg-4">
                  <div className="blog-list-sidebar-box-fixed">
                    <ContactForm />
                    <div className="blog-list-sidebar">
                      <ul className="blog-list-sidebar-ul">
                        {relatedBlogs?.map((item) => (
                          <li key={item.id} className="blog-list-sidebar-li">
                            <ChevronsRight></ChevronsRight>
                            <Link href={`/blog/${item.urlslug}`} className="blog-list-link">
                              {item.title}
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
    </>
  );
}
