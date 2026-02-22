"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollImage } from "@/components/ui/scroll-image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  slug?: string;
}

export function ProductImageGallery({
  images,
  productName,
  slug,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  // IntersectionObserver for mobile scroll tracking
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const slides = container.querySelectorAll("[data-slide]");
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.slide ?? 0
            );
            setMobileIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.6 }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [images.length]);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-muted text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Main image + thumbnails */}
      <div className="hidden md:block">
        {/* Main image — cinematic scroll reveal */}
        <button
          className="relative w-full aspect-[4/5] bg-muted cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ScrollImage
                src={images[activeIndex]}
                alt={`${productName} — Image ${activeIndex + 1}`}
                fill
                sizes="50vw"
                priority={activeIndex === 0}
                radius="0.75rem"
                scaleFrom={1.1}
                containerClassName="h-full w-full"
                style={
                  slug && activeIndex === 0
                    ? { viewTransitionName: `product-${slug}` }
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  i === activeIndex
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Swipeable gallery */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        >
          {images.map((img, i) => (
            <div
              key={i}
              data-slide={i}
              className="w-full flex-none snap-center"
            >
              <button
                className="relative w-full aspect-[4/5] bg-muted"
                onClick={() => {
                  setActiveIndex(i);
                  setLightboxOpen(true);
                }}
              >
                <ScrollImage
                  src={img}
                  alt={`${productName} — Image ${i + 1}`}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  radius="0"
                  scaleFrom={1.08}
                  containerClassName="h-full w-full"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  i === mobileIndex
                    ? "w-4 bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl border-none bg-black/95 p-0">
          <DialogTitle className="sr-only">
            {productName} — Image {activeIndex + 1} of {images.length}
          </DialogTitle>
          <div className="relative flex aspect-[4/5] max-h-[85vh] items-center justify-center">
            <Image
              src={images[activeIndex]}
              alt={`${productName} — Image ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />

            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
