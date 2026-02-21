import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { NewsletterCTA } from "@/components/marketing/newsletter-cta";
import type { BlogPosting, WithContext } from "schema-dts";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // Helper function to construct proper image URL
  const getImageUrl = (imagePath: string): string => {
    // If it's already a complete URL, use as-is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // If it's an absolute path, prepend domain only
    if (imagePath.startsWith("/")) {
      return `https://rebirth.world${imagePath}`;
    }
    // If it's a relative path, prepend domain with slash
    return `https://rebirth.world/${imagePath}`;
  };

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.tags,
      images: post.thumbnail
        ? [
            {
              url: getImageUrl(post.thumbnail),
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: "https://rebirth.world/og/blog.png",
              width: 1200,
              height: 630,
              alt: "Rebirth World Blog",
            },
          ],
      url: `https://rebirth.world/blog/${slug}`,
      siteName: "Rebirth World",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.thumbnail ? [getImageUrl(post.thumbnail)] : ["/og/blog.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author?.name || "Rebirth World Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Rebirth World",
      logo: {
        "@type": "ImageObject",
        url: "https://rebirth.world/logo.png",
      },
    },
    image: post.thumbnail
      ? `https://rebirth.world${post.thumbnail}`
      : "https://rebirth.world/og/blog.png",
    url: `https://rebirth.world/blog/${slug}`,
    keywords: post.tags?.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://rebirth.world/blog/${slug}`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article>
          <header>
            <h1 className="mb-6 text-5xl leading-tight font-bold">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
                {post.description}
              </p>
            )}

            <div className="mb-8 flex items-center justify-between">
              {post.author && (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    {post.author.picture && (
                      <AvatarImage
                        src={post.author.picture}
                        alt={post.author.name}
                      />
                    )}
                    <AvatarFallback className="text-sm">
                      {post.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">
                    {post.author.name}
                  </span>
                </div>
              )}

              <time dateTime={post.date} className="text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          <Separator className="my-8" />

          <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:decoration-blue-600/30 prose-a:underline-offset-4 hover:prose-a:decoration-blue-600/60 prose-strong:text-foreground prose-pre:bg-transparent prose-pre:p-0 prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:bg-muted/50 prose-blockquote:px-6 prose-blockquote:py-4 prose-th:text-foreground prose-td:text-foreground max-w-none">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      {
                        theme: {
                          dark: "github-dark",
                          light: "github-light",
                        },
                        keepBackground: false,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>
        </article>
      </div>
      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
  );
}
