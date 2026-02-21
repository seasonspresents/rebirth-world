import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "src/content/blog");

export interface Author {
  name: string;
  picture?: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  author?: Author;
  thumbnail?: string;
  tags?: string[];
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
}

/**
 * Get all blog posts from the content directory
 * Returns posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_PATH)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_PATH);

  const posts = files
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(CONTENT_PATH, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(".mdx", ""),
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        description: data.description || "",
        author: data.author,
        thumbnail: data.thumbnail,
        tags: data.tags || [],
      } as BlogPostMetadata;
    });

  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get a single blog post by slug
 * Returns the post metadata and content
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      description: data.description || "",
      author: data.author,
      thumbnail: data.thumbnail,
      tags: data.tags || [],
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  if (!fs.existsSync(CONTENT_PATH)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_PATH);
  return files
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(".mdx", ""));
}
