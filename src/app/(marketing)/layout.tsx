import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
