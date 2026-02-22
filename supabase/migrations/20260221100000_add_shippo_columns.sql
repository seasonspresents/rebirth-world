-- Add Shippo shipping label columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shippo_transaction_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shippo_label_url text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_carrier text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_rate_amount integer; -- cents
