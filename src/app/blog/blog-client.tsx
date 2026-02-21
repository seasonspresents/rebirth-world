"use client";

import Link from "next/link";
import { BlogPostMetadata } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

interface BlogClientProps {
  posts: BlogPostMetadata[];
  allTags: string[];
}

export default function BlogClient({ posts, allTags }: BlogClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter posts based on selected tag
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
  };

  return (
    <>
      {/* Tag Filter Buttons */}
      {allTags.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagFilter(null)}
            >
              All Posts
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagFilter(tag)}
                className="capitalize"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-lg">
            {selectedTag
              ? `No posts found with tag "${selectedTag}"`
              : "No blog posts yet. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 md:gap-x-6 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card
              key={post.slug}
              className="bg-card hover:bg-accent h-full cursor-pointer transition-all duration-200"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="line-clamp-2 min-h-14 text-xl group-hover:underline md:min-h-16">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-base">
                    {post.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto">
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          {post.author.picture && (
                            <AvatarImage
                              src={post.author.picture}
                              alt={post.author.name}
                              className="aspect-square size-full"
                            />
                          )}
                          <AvatarFallback className="text-xs">
                            {post.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
