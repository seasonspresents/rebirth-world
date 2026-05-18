import Image from "next/image";
import { Hammer, Leaf, Recycle } from "lucide-react";
import type { Product } from "@/lib/payments/constants";

type ProductStoryBlockProps = {
  product: Product;
  tone?: "dark" | "warm";
};

const COLLECTION_LABELS: Record<string, string> = {
  "skateboard-rings": "Recycled skateboard ring",
  "wedding-bands": "Wood-lined wedding band",
  apparel: "Small-batch apparel",
  accessories: "Rebirth accessory",
};

const FALLBACK_STORIES: Record<string, string> = {
  "skateboard-rings":
    "Every skateboard ring starts as a broken deck with color, scuffs, and a past. Daniel cuts the layered maple, shapes it by hand, and finishes it into a piece that carries the session forward.",
  "wedding-bands":
    "Each wedding band pairs a durable metal shell with a hand-fitted wood liner chosen for grain, warmth, and meaning. It is built to feel personal from the first day and lived-in for years.",
  apparel:
    "Each apparel piece carries the Rebirth message into daily wear: bless what is breaking, carry what is blooming, and keep moving into the next chapter with intention.",
  accessories:
    "Small Rebirth objects are made to carry the same material story as the rings: useful, intentional, and connected to the community that shaped them.",
};

function getCollectionLabel(collection?: string) {
  if (!collection) return "Rebirth piece";
  return COLLECTION_LABELS[collection] ?? "Rebirth piece";
}

function getStory(product: Product) {
  const collection = product.metadata.collection ?? "";
  return (
    product.metadata.story ||
    product.metadata.handmade_note ||
    FALLBACK_STORIES[collection] ||
    product.description ||
    "Made by Rebirth with reclaimed materials, careful hands, and the belief that nothing with a story needs to be wasted."
  );
}

function getMaterial(product: Product) {
  if (product.metadata.material) return product.metadata.material;

  switch (product.metadata.collection) {
    case "skateboard-rings":
      return "Reclaimed skateboard maple, shaped and sealed by hand.";
    case "wedding-bands":
      return "Metal shell with a hand-fitted wood liner.";
    case "apparel":
      return "Small-batch fabric selected for everyday wear.";
    default:
      return "Rebirth materials selected for story, function, and feel.";
  }
}

function getCare(product: Product) {
  if (product.metadata.care_instructions) return product.metadata.care_instructions;

  if (product.metadata.collection === "apparel") {
    return "Wash cold, tumble low, and wear it into the next chapter.";
  }

  return "Keep dry when possible, avoid harsh chemicals, and clean with a soft cloth.";
}

export function ProductStoryBlock({
  product,
  tone = "dark",
}: ProductStoryBlockProps) {
  const image = product.images[1] ?? product.images[0];
  const isDark = tone === "dark";
  const collectionLabel = getCollectionLabel(product.metadata.collection);
  const storyNoun = product.metadata.collection === "apparel" ? "Piece" : "Ring";

  const details = [
    {
      icon: Recycle,
      label: "Material",
      value: getMaterial(product),
    },
    {
      icon: Hammer,
      label: "Process",
      value:
        product.metadata.handmade_note ||
        "Cut, shaped, checked, and finished by hand before it leaves the workshop.",
    },
    {
      icon: Leaf,
      label: "Care",
      value: getCare(product),
    },
  ];

  return (
    <section
      className={
        isDark
          ? "bg-[var(--rebirth-warm-black)] px-5 py-16 text-[var(--rebirth-film-cream)] md:py-24"
          : "bg-[#f2ece0] px-5 py-16 text-[#1c1a17] md:py-24"
      }
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
        <div>
          <p
            className={
              isDark
                ? "mb-3 text-[11px] font-bold uppercase tracking-[2.4px] text-[var(--rebirth-amber)]"
                : "mb-3 text-[11px] font-bold uppercase tracking-[2.4px] text-[#c4603a]"
            }
          >
            {collectionLabel}
          </p>
          <h2 className="max-w-[12ch] font-[family-name:var(--font-serif)] text-[clamp(36px,5vw,64px)] font-bold italic leading-[1.04]">
            The Story Behind This {storyNoun}
          </h2>
          <p
            className={
              isDark
                ? "mt-6 max-w-[620px] text-base leading-[1.8] text-white/70 md:text-lg"
                : "mt-6 max-w-[620px] text-base leading-[1.8] text-[#5f594f] md:text-lg"
            }
          >
            {getStory(product)}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className={
                  isDark
                    ? "border border-white/10 bg-white/[0.04] p-4"
                    : "border border-[#dfd4c3] bg-white/35 p-4"
                }
              >
                <Icon
                  className={
                    isDark
                      ? "mb-3 h-5 w-5 text-[var(--rebirth-amber)]"
                      : "mb-3 h-5 w-5 text-[#c4603a]"
                  }
                  aria-hidden="true"
                />
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px]">
                  {label}
                </div>
                <p
                  className={
                    isDark
                      ? "text-sm leading-[1.65] text-white/60"
                      : "text-sm leading-[1.65] text-[#6e665a]"
                  }
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {image ? (
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={image}
              alt={`${product.name} material and story detail`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
