import { getAllPosts } from "@/lib/posts";
import BlogClient from "./blog-client";
import { Metadata } from "next";
import type { Blog, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read our latest articles about web development, Next.js, React, and more. Stay updated with tutorials, insights, and best practices.",
  keywords: [
    "blog",
    "web development",
    "Next.js",
    "React",
    "TypeScript",
    "tutorials",
    "programming articles",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Blog | Rebirth World",
    description:
      "Read our latest articles about web development, Next.js, React, and more. Stay updated with tutorials, insights, and best practices.",
    url: "https://rebirth.world/blog",
    siteName: "Rebirth World",
    images: [
      {
        url: "/og/blog.png",
        width: 1200,
        height: 630,
        alt: "Rebirth World Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Rebirth World",
    description:
      "Read our latest articles about web development, Next.js, React, and more.",
    images: ["/og/blog.png"],
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  const jsonLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Rebirth World Blog",
    description:
      "Read our latest articles about web development, Next.js, React, and more.",
    url: "https://rebirth.world/blog",
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `https://rebirth.world/blog/${post.slug}`,
      author: {
        "@type": "Person",
        name: post.author?.name || "Rebirth World Team",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-4 text-5xl font-semibold">Blog</h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              Insights, tutorials, and updates about modern web development
            </p>
          </div>

          <BlogClient posts={posts} allTags={allTags} />
        </div>
      </div>
    </>
  );
}
