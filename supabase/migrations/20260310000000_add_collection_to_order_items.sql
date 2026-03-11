-- Add collection column to order_items for parcel sizing in shipping
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS collection text;
