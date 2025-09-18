import {
  fetchBlogDetail,
  fetchCategoryBlogs,
  fetchBlogList,
} from "../../../lib/api/blogs";
import MainHeader from "../../Common/MainHeader";
import BlogDetail from "../../Components/BlogDetail";
import BlogCategory from "../../Components/BlogCategory";

export const dynamicParams = true; // Enable SSR for dynamic paths

// Dynamic SEO metadata
export async function generateMetadata({ params }) {
  
  // const { slug } = params;
  const rawSlug = params.slug; // e.g., "my-blog.html"
  const slug = rawSlug.replace(/\.html$/, ""); // Remove .html

  try {
    const blog = await fetchBlogDetail(slug);
    if (blog) {
      return {
        title: blog.meta_title || blog.title,
        description: blog.meta_description || blog.short_description,
        alternates: {
          canonical: `${rawSlug}`,
        },
      };
    }

    const categoryBlogs = await fetchCategoryBlogs(slug);
    if (categoryBlogs && categoryBlogs.length > 0) {
      const categoryName = categoryBlogs[0].category_name || slug;
      return {
        title: `${categoryName} Blogs`,
        description: `Explore blogs under the ${categoryName} category.`,
        alternates: {
          canonical: `${rawSlug}`,
        },
      };
    }
  } catch {}
    return {
    title: "Amritara Hotels - Best Resorts in India - Official Website Blog",
    description: "Amritara Hotels and Resorts offers a collection of unique and luxurious stays across India. Explore our blog for travel tips, destination guides, and more.",
  };
}

 

// Page rendering
export default async function SlugPage({ params }) {
  const rawSlug = params.slug;
  const slug = rawSlug.replace(/\.html$/, "");

  let blog = null;
  try {
    blog = await fetchBlogDetail(slug);
  } catch {}

  if (blog) {
    const allBlogs = await fetchBlogList();
    const relatedBlogs = allBlogs.filter(
      (item) => item.category_id === blog.category_id && item.id !== blog.id
    );
    return (
      <>
        <section className="home-hdr-hght"><MainHeader></MainHeader></section>
        <BlogDetail blog={blog} relatedBlogs={relatedBlogs} />
      </>
    );
  }

  let categoryBlogs = [];
  try {
    categoryBlogs = await fetchCategoryBlogs(slug);
  } catch {}

  if (categoryBlogs && categoryBlogs.length > 0) {
    return (
      <>
        <section className="home-hdr-hght">
          <MainHeader></MainHeader>
        </section>
        <BlogCategory slug={slug} blogs={categoryBlogs} />
      </>
    );
  }

  return <div>Not Found</div>;
}