export async function fetchBlogList() {
  const response = await fetch('https://amritara.cinuniverse.com/blog-lists.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'blog-list' }),
    cache: 'no-store', // disable caching on server
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }

  const result = await response.json();
  return result.data; // return array of blog posts
}

export async function fetchBlogDetail(slug) {
  const response = await fetch('https://amritara.cinuniverse.com/blog-detail.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'detail', url_slug: slug }),
    cache: 'no-store', // disable caching on server
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog detail');
  }

  const result = await response.json();
  return result.data[0]; // return single blog post
}

export async function fetchCategoryBlogs(slug) {
  const response = await fetch('https://amritara.cinuniverse.com/category-list.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'list', category_slug: slug }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category blogs');
  }

  const result = await response.json();
  return result.data;
}

