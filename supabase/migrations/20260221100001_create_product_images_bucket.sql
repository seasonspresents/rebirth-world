-- Create product-images storage bucket (public read, admin-only write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload (admin check is done at API level)
CREATE POLICY "Authenticated upload for product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');
