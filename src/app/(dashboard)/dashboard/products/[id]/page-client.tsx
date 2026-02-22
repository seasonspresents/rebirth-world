"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Save,
  ExternalLink,
  Upload,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "../../layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/auth/auth-context";
import { isClientAdmin } from "@/lib/admin-client";
import { COLLECTIONS } from "@/lib/payments/constants";

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  metadata: Record<string, string | undefined>;
  active: boolean;
  price: number; // cents
  priceId: string;
  currency: string;
}

export default function ProductEditClient({
  productId,
}: {
  productId: string;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceDisplay, setPriceDisplay] = useState(""); // dollar string
  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(true);
  const [collection, setCollection] = useState("");
  const [material, setMaterial] = useState("");
  const [ringSizes, setRingSizes] = useState("");
  const [slug, setSlug] = useState("");
  const [featured, setFeatured] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [story, setStory] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [handmadeNote, setHandmadeNote] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [weight, setWeight] = useState("");
  const [engravingAvailable, setEngravingAvailable] = useState(false);
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Drag state for image reordering
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isClientAdmin(user?.id)) {
      router.push("/dashboard");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !isClientAdmin(user?.id)) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        const p = data.product as ProductData;
        setProduct(p);

        // Initialize form
        setName(p.name);
        setDescription(p.description || "");
        setPriceDisplay((p.price / 100).toFixed(2));
        setImages(p.images || []);
        setActive(p.active);
        setCollection(p.metadata.collection || "");
        setMaterial(p.metadata.material || "");
        setRingSizes(p.metadata.ring_sizes || "");
        setSlug(p.metadata.slug || "");
        setFeatured(p.metadata.featured === "true");
        setSubtitle(p.metadata.subtitle || "");
        setStory(p.metadata.story || "");
        setCareInstructions(p.metadata.care_instructions || "");
        setHandmadeNote(p.metadata.handmade_note || "");
        setLeadTime(p.metadata.lead_time || "");
        setWeight(p.metadata.weight || "");
        setEngravingAvailable(p.metadata.engraving_available === "true");
        setCompareAtPrice(p.metadata.compare_at_price || "");
        setBadgeText(p.metadata.badge_text || "");
        setSortOrder(p.metadata.sort_order || "");
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setNotFound(true);
      } finally {
        setDataLoading(false);
      }
    }

    fetchProduct();
  }, [user, authLoading, productId]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    const priceInCents = Math.round(parseFloat(priceDisplay) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error("Enter a valid price");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim(),
        images,
        active,
        price: priceInCents,
        metadata: {
          collection: collection || undefined,
          material: material || undefined,
          ring_sizes: ringSizes || undefined,
          slug: slug || undefined,
          featured: featured ? "true" : "false",
          subtitle: subtitle || undefined,
          story: story || undefined,
          care_instructions: careInstructions || undefined,
          handmade_note: handmadeNote || undefined,
          lead_time: leadTime || undefined,
          weight: weight || undefined,
          engraving_available: engravingAvailable ? "true" : "false",
          compare_at_price: compareAtPrice || undefined,
          badge_text: badgeText || undefined,
          sort_order: sortOrder || undefined,
        },
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || "Failed to save product");
        return;
      }

      const data = await res.json();
      if (data.product) {
        setProduct({
          ...data.product,
          metadata: data.product.metadata || {},
        });
      }
      toast.success("Product saved");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || "Failed to upload image");
        return;
      }

      const data = await res.json();
      setImages((prev) => [...prev, data.url]);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const newImages = [...prev];
      const [moved] = newImages.splice(from, 1);
      newImages.splice(to, 0, moved);
      return newImages;
    });
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    setImages((prev) => {
      const newImages = [...prev];
      const dragged = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(index, 0, dragged);
      return newImages;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const isLoading = authLoading || dataLoading;

  const makeBreadcrumb = (productName?: string) => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="font-semibold">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard/products"
            className="font-semibold"
          >
            Products
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-[200px] truncate font-semibold">
            {productName || "..."}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (isLoading) {
    return (
      <>
        <DashboardHeader breadcrumb={makeBreadcrumb()} />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="max-w-5xl space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-6">
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !product) {
    return (
      <>
        <DashboardHeader breadcrumb={makeBreadcrumb()} />
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="max-w-4xl">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <AlertCircle className="text-muted-foreground h-12 w-12" />
                <h2 className="text-xl font-semibold">Product not found</h2>
                <p className="text-muted-foreground">
                  This product doesn&apos;t exist or could not be loaded from
                  Stripe.
                </p>
                <Button asChild variant="outline">
                  <Link href="/dashboard/products">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        breadcrumb={makeBreadcrumb(product.name)}
        actions={
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1 h-4 w-4" />
            )}
            Save Changes
          </Button>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <div className="max-w-5xl space-y-4 md:space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/products">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="ml-auto flex items-center gap-2">
              {slug && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/shop/${slug}`} target="_blank">
                    <span className="hidden sm:inline">View on Store</span>
                    <span className="sm:hidden">Store</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://dashboard.stripe.com/products/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stripe
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_340px]">
            {/* Left column — main fields */}
            <div className="space-y-4 md:space-y-6">
              {/* Basic info */}
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Name</Label>
                    <Input
                      id="product-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product description"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price (USD)</Label>
                      <div className="relative">
                        <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                          $
                        </span>
                        <Input
                          id="product-price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={priceDisplay}
                          onChange={(e) => setPriceDisplay(e.target.value)}
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="flex items-end space-x-3 pb-1">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="product-active"
                          checked={active}
                          onCheckedChange={setActive}
                        />
                        <Label htmlFor="product-active">
                          {active ? (
                            <Badge className="bg-green-500 text-white">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-400 text-white">
                              Inactive
                            </Badge>
                          )}
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Drag to reorder. First image is the primary display image.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-4">
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                        {images.map((url, index) => (
                          <div
                            key={`${url}-${index}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group relative aspect-square overflow-hidden rounded-lg border ${
                              dragIndex === index
                                ? "opacity-50"
                                : ""
                            }`}
                          >
                            <Image
                              src={url}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="200px"
                            />
                            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                            {/* Remove button */}
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-2 sm:p-1.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                            >
                              <X className="h-4 w-4 text-white sm:h-3.5 sm:w-3.5" />
                            </button>
                            {/* Reorder buttons (mobile) / drag handle (desktop) */}
                            <div className="absolute bottom-1.5 right-1.5 flex gap-1 sm:hidden">
                              {index > 0 && (
                                <button
                                  onClick={() => moveImage(index, index - 1)}
                                  className="rounded-full bg-black/60 p-1.5"
                                >
                                  <ChevronUp className="h-4 w-4 text-white" />
                                </button>
                              )}
                              {index < images.length - 1 && (
                                <button
                                  onClick={() => moveImage(index, index + 1)}
                                  className="rounded-full bg-black/60 p-1.5"
                                >
                                  <ChevronDown className="h-4 w-4 text-white" />
                                </button>
                              )}
                            </div>
                            <div className="absolute left-1.5 top-1.5 hidden cursor-grab rounded-full bg-black/60 p-1.5 sm:group-hover:block">
                              <GripVertical className="h-3.5 w-3.5 text-white" />
                            </div>
                            {index === 0 && (
                              <Badge className="absolute bottom-1.5 left-1.5 bg-blue-500 text-xs text-white">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      {uploading ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-1 h-4 w-4" />
                      )}
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Story & copy */}
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle>Story & Copy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-subtitle">Subtitle</Label>
                    <Input
                      id="product-subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Poetic material descriptor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-story">Story</Label>
                    <Textarea
                      id="product-story"
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="1-2 sentence origin story"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-care">Care Instructions</Label>
                    <Textarea
                      id="product-care"
                      value={careInstructions}
                      onChange={(e) => setCareInstructions(e.target.value)}
                      placeholder="How to care for this product"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-handmade">Handmade Note</Label>
                    <Input
                      id="product-handmade"
                      value={handmadeNote}
                      onChange={(e) => setHandmadeNote(e.target.value)}
                      placeholder="Artisan callout"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column — metadata */}
            <div className="space-y-4 md:space-y-6 lg:sticky lg:top-4 lg:self-start">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle>Catalog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-collection">Collection</Label>
                    <Select value={collection} onValueChange={setCollection}>
                      <SelectTrigger id="product-collection">
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLECTIONS.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-slug">Slug</Label>
                    <Input
                      id="product-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="url-friendly-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-material">Material</Label>
                    <Input
                      id="product-material"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g. recycled-skateboard"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-ring-sizes">
                      Ring Sizes (comma-separated)
                    </Label>
                    <Input
                      id="product-ring-sizes"
                      value={ringSizes}
                      onChange={(e) => setRingSizes(e.target.value)}
                      placeholder="5,6,7,8,9,10,11,12"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle>Display</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-badge">Badge Text</Label>
                    <Input
                      id="product-badge"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="e.g. New, Best Seller"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-compare-price">
                      Compare At Price (cents)
                    </Label>
                    <Input
                      id="product-compare-price"
                      type="number"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="Strikethrough price in cents"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-sort">Sort Order</Label>
                    <Input
                      id="product-sort"
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      placeholder="Lower = higher priority"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="product-featured"
                      checked={featured}
                      onCheckedChange={(v) => setFeatured(v === true)}
                    />
                    <Label htmlFor="product-featured">Featured product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="product-engraving"
                      checked={engravingAvailable}
                      onCheckedChange={(v) =>
                        setEngravingAvailable(v === true)
                      }
                    />
                    <Label htmlFor="product-engraving">
                      Engraving available
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-lead-time">Lead Time (days)</Label>
                    <Input
                      id="product-lead-time"
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      placeholder="e.g. 5-7"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-weight">Weight (grams)</Label>
                    <Input
                      id="product-weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 15"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save button (bottom of sidebar) */}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
                size="lg"
              >
                {saving ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
