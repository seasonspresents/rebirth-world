"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Plus, Send, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { reviewCreateSchema } from "@/lib/reviews";
import { cn } from "@/lib/utils";

type FormErrors = Partial<
  Record<
    "orderItemId" | "rating" | "title" | "body" | "photos" | "form",
    string
  >
>;

type ReviewResponse = {
  error?: string;
  review?: {
    id?: string;
  };
};

function firstParam(searchParams: URLSearchParams, names: string[]) {
  for (const name of names) {
    const value = searchParams.get(name);
    if (value) return value;
  }

  return "";
}

function isUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function currentReturnPath() {
  if (typeof window === "undefined") return "/review";
  return `${window.location.pathname}${window.location.search}`;
}

export function ReviewSubmissionForm() {
  const searchParams = useSearchParams();
  const orderItemId = useMemo(
    () =>
      firstParam(searchParams, [
        "orderItemId",
        "order_item_id",
        "item",
        "lineItem",
      ]),
    [searchParams]
  );
  const productStripeId = useMemo(
    () => firstParam(searchParams, ["productId", "product_stripe_id"]),
    [searchParams]
  );
  const productName = useMemo(
    () => firstParam(searchParams, ["productName", "product_name", "name"]),
    [searchParams]
  );

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReviewId, setSubmittedReviewId] = useState<string | null>(
    null
  );
  const [authRequired, setAuthRequired] = useState(false);

  const hasReviewContext = orderItemId.length > 0;

  const handleSignInClick = () => {
    sessionStorage.setItem("signin-redirect-to", currentReturnPath());
  };

  const addPhoto = () => {
    const nextUrl = photoUrl.trim();
    if (!nextUrl) return;

    if (photos.length >= 5) {
      setErrors((current) => ({
        ...current,
        photos: "Add up to five photos.",
      }));
      return;
    }

    if (!isUrl(nextUrl)) {
      setErrors((current) => ({
        ...current,
        photos: "Enter a valid photo URL.",
      }));
      return;
    }

    if (photos.includes(nextUrl)) {
      setPhotoUrl("");
      return;
    }

    setPhotos((current) => [...current, nextUrl]);
    setPhotoUrl("");
    setErrors((current) => ({ ...current, photos: undefined }));
  };

  const removePhoto = (photo: string) => {
    setPhotos((current) => current.filter((item) => item !== photo));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setAuthRequired(false);

    const parsed = reviewCreateSchema.safeParse({
      orderItemId,
      productStripeId: productStripeId || undefined,
      rating,
      title,
      body,
      photos,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        orderItemId: fieldErrors.orderItemId?.[0],
        rating: fieldErrors.rating?.[0],
        title: fieldErrors.title?.[0],
        body: fieldErrors.body?.[0],
        photos: fieldErrors.photos?.[0],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response
        .json()
        .catch(() => ({}))) as ReviewResponse;

      if (!response.ok) {
        if (response.status === 401) {
          setAuthRequired(true);
          throw new Error("Sign in to submit your verified purchase review.");
        }

        if (response.status === 403) {
          throw new Error(
            "This review link could not be verified for your account."
          );
        }

        if (response.status === 409) {
          throw new Error("A review already exists for this order item.");
        }

        throw new Error(payload.error ?? "Unable to submit review.");
      }

      setSubmittedReviewId(payload.review?.id ?? null);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        form:
          error instanceof Error ? error.message : "Unable to submit review.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="border-b px-6 pt-24 pb-14 md:pt-28">
        <div className="mx-auto max-w-3xl border-x px-6 py-10 md:py-14">
          <Card className="rounded-lg">
            <CardContent className="flex flex-col items-start gap-5">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <div className="space-y-3">
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
                  Review submitted
                </h1>
                <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
                  Thank you. Your review is pending moderation and will appear
                  after it is approved.
                </p>
              </div>
              {submittedReviewId && (
                <p className="text-muted-foreground text-sm">
                  Reference: {submittedReviewId}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b px-6 pt-24 pb-14 md:pt-28">
      <div className="mx-auto max-w-6xl border-x px-6 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm font-medium uppercase">
                Verified review
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-balance md:text-5xl">
                Share the piece after it has lived with you.
              </h1>
              <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
                Your review is tied to the purchased item from your order, then
                held for moderation before it appears publicly.
              </p>
            </div>

            <div className="border-t pt-6 text-sm">
              <dl className="grid gap-3">
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground">Item context</dt>
                  <dd className="font-medium break-all">
                    {hasReviewContext ? orderItemId : "Missing from link"}
                  </dd>
                </div>
                {productName && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-muted-foreground">Piece</dt>
                    <dd className="font-medium">{productName}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <Card className="rounded-lg">
            <CardContent>
              <form className="space-y-7" onSubmit={handleSubmit}>
                {!hasReviewContext && (
                  <Alert variant="destructive">
                    <AlertTitle>Review link missing item context</AlertTitle>
                    <AlertDescription>
                      Open the review link from your email so the purchased item
                      can be verified.
                    </AlertDescription>
                  </Alert>
                )}

                {errors.form && (
                  <Alert variant={authRequired ? "default" : "destructive"}>
                    <AlertTitle>
                      {authRequired
                        ? "Sign in required"
                        : "Review not submitted"}
                    </AlertTitle>
                    <AlertDescription className="space-y-3">
                      <span>{errors.form}</span>
                      {authRequired && (
                        <Button asChild size="sm" onClick={handleSignInClick}>
                          <Link href="/sign-in">Sign in</Link>
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <FieldGroup>
                  <Field data-invalid={Boolean(errors.rating)}>
                    <FieldLabel>Rating</FieldLabel>
                    <div className="flex min-h-11 items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`${value} star${value === 1 ? "" : "s"}`}
                          aria-pressed={rating === value}
                          className="h-11 w-11"
                          onClick={() => setRating(value)}
                        >
                          <Star
                            className={cn(
                              "h-7 w-7 transition-colors",
                              value <= rating
                                ? "fill-amber-400 text-amber-500"
                                : "text-muted-foreground"
                            )}
                          />
                        </Button>
                      ))}
                    </div>
                    {errors.rating && <FieldError>{errors.rating}</FieldError>}
                  </Field>

                  <Field data-invalid={Boolean(errors.title)}>
                    <FieldLabel htmlFor="review-title">Title</FieldLabel>
                    <Input
                      id="review-title"
                      value={title}
                      maxLength={120}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="What stood out?"
                    />
                    {errors.title && <FieldError>{errors.title}</FieldError>}
                  </Field>

                  <Field data-invalid={Boolean(errors.body)}>
                    <FieldLabel htmlFor="review-body">Review</FieldLabel>
                    <Textarea
                      id="review-body"
                      value={body}
                      maxLength={5000}
                      onChange={(event) => setBody(event.target.value)}
                      placeholder="Fit, finish, materials, gifting moment, daily wear."
                      className="min-h-36 resize-none"
                    />
                    {errors.body && <FieldError>{errors.body}</FieldError>}
                  </Field>

                  <Field data-invalid={Boolean(errors.photos)}>
                    <FieldLabel htmlFor="review-photo">Photos</FieldLabel>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="review-photo"
                        type="url"
                        value={photoUrl}
                        onChange={(event) => setPhotoUrl(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addPhoto();
                          }
                        }}
                        placeholder="https://"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addPhoto}
                        disabled={photos.length >= 5}
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    <FieldDescription>{photos.length}/5 added</FieldDescription>
                    {photos.length > 0 && (
                      <ul className="grid gap-2">
                        {photos.map((photo) => (
                          <li
                            key={photo}
                            className="border-border flex min-h-10 items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                          >
                            <span className="min-w-0 truncate">{photo}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Remove photo"
                              onClick={() => removePhoto(photo)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.photos && <FieldError>{errors.photos}</FieldError>}
                  </Field>
                </FieldGroup>

                <CardFooter className="px-0 pb-0">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !hasReviewContext}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit review
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
