import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl border-x">{children}</main>
      <Footer />
    </div>
  );
}
