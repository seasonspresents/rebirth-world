import { z } from "zod";

export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export const reviewStatusSchema = z.enum(REVIEW_STATUSES);

const nullableTitleSchema = z.string().trim().max(120).nullable().optional();
const nullableBodySchema = z.string().trim().max(5000).nullable().optional();
const photosSchema = z.array(z.string().trim().url()).max(5);

export const reviewCreateSchema = z.object({
  orderItemId: z.string().uuid(),
  productStripeId: z.string().trim().min(1).optional(),
  rating: z.number().int().min(1).max(5),
  title: nullableTitleSchema,
  body: nullableBodySchema,
  photos: photosSchema.default([]),
});

export const reviewUpdateSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    title: nullableTitleSchema,
    body: nullableBodySchema,
    photos: photosSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one review field is required",
  });

export const reviewModerationSchema = z
  .object({
    status: reviewStatusSchema.optional(),
    adminResponse: z.string().trim().max(2000).nullable().optional(),
  })
  .refine(
    (data) => data.status !== undefined || data.adminResponse !== undefined,
    {
      message: "At least one moderation field is required",
    }
  );

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

const REVIEWABLE_ORDER_STATUSES = new Set([
  "confirmed",
  "processing",
  "shipped",
  "delivered",
]);

export function isReviewableOrder(order: {
  payment_status: string;
  status: string;
}) {
  return (
    order.payment_status === "paid" &&
    REVIEWABLE_ORDER_STATUSES.has(order.status)
  );
}

export function normalizeNullableText(value: string | null | undefined) {
  if (value === null || value === undefined) return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
