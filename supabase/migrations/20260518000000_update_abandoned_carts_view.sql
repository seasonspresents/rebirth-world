-- Add cart value to abandoned cart recovery targeting.
-- Eligibility remains: logged-in carts with items older than 1 hour and no
-- completed order after the latest cart activity.

CREATE OR REPLACE VIEW public.abandoned_carts AS
SELECT
  ci.user_id,
  up.full_name,
  u.email,
  COUNT(ci.id) AS item_count,
  COALESCE(SUM(COALESCE(ci.unit_price_cents, 0) * ci.quantity), 0) AS cart_value,
  MAX(ci.updated_at) AS last_activity
FROM public.cart_items ci
JOIN auth.users u ON u.id = ci.user_id
LEFT JOIN public.user_profiles up ON up.user_id = ci.user_id
WHERE ci.updated_at < NOW() - INTERVAL '1 hour'
AND NOT EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.user_id = ci.user_id
  AND o.created_at > ci.updated_at
)
GROUP BY ci.user_id, up.full_name, u.email;

ALTER VIEW public.abandoned_carts SET (security_invoker = on);
REVOKE SELECT ON public.abandoned_carts FROM anon, authenticated;
