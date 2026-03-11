-- Store Shippo rate ID on orders for one-click label purchase
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shippo_rate_id text;
