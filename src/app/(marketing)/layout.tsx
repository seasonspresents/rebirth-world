import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { BottomNav } from "@/components/shared/bottom-nav";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SectionColorBlender } from "@/components/marketing/section-color-blender";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="cursor-custom overflow-x-clip">
        <CustomCursor />
        <SectionColorBlender />
        <Header />
        <CartDrawer />
        <main className="pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </div>
    </SmoothScrollProvider>
  );
}
