import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Terms of Service - Rebirth World",
  description:
    "Terms and conditions governing the use of Rebirth World's conversational assistant services.",
  alternates: {
    canonical: "/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service - Rebirth World",
    description:
      "Terms and conditions governing the use of Rebirth World's conversational assistant services.",
    type: "website",
    siteName: "Rebirth World",
  },
};

export default async function TermsOfServicePage() {
  const filePath = path.join(
    process.cwd(),
    "src/content/legal/terms-of-service.mdx"
  );
  const content = fs.readFileSync(filePath, "utf8");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:mb-8 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-strong:font-medium prose-ul:space-y-2 prose-li:text-muted-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-a:hover:text-muted-foreground prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:p-3 prose-td:p-3 prose-table:border prose-th:border prose-td:border max-w-none">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </article>
    </div>
  );
}
