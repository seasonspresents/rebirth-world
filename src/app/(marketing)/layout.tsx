import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { CartDrawer } from "@/components/cart/cart-drawer";
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
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
