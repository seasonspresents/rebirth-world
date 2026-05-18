/**
 * Register or update the Shippo tracking webhook.
 * Run: pnpm exec tsx scripts/register-shippo-webhook.ts
 */

import { config } from "dotenv";

config({ path: ".env.local" });

interface ShippoWebhook {
  object_id?: string;
  event?: string;
  url?: string;
  active?: boolean;
  is_test?: boolean;
}

interface ShippoWebhookList {
  results?: ShippoWebhook[];
}

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY;
const SHIPPO_WEBHOOK_SECRET = process.env.SHIPPO_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rebirth.world";

if (!SHIPPO_API_KEY) {
  console.error("Missing SHIPPO_API_KEY.");
  process.exit(1);
}

if (!SHIPPO_WEBHOOK_SECRET) {
  console.error("Missing SHIPPO_WEBHOOK_SECRET.");
  process.exit(1);
}

const webhookUrl = new URL("/api/webhooks/shippo", SITE_URL);
webhookUrl.searchParams.set("token", SHIPPO_WEBHOOK_SECRET);

const targetOriginPath = `${webhookUrl.origin}${webhookUrl.pathname}`;
const redactedWebhookUrl = `${targetOriginPath}?token=[redacted]`;
const isTestWebhook = /test/i.test(SHIPPO_API_KEY.slice(0, 32));

const headers = {
  Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
  "Content-Type": "application/json",
};

async function shippoRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`https://api.goshippo.com${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const detail =
      body && typeof body === "object" && "detail" in body
        ? String(body.detail)
        : JSON.stringify(body);
    throw new Error(
      `Shippo ${options.method || "GET"} ${path} failed: ${detail}`
    );
  }

  return body as T;
}

async function main() {
  const list = await shippoRequest<ShippoWebhookList | ShippoWebhook[]>(
    "/webhooks/"
  );
  const webhooks = Array.isArray(list) ? list : list.results || [];
  const existing = webhooks.find(
    (hook) =>
      hook.event === "track_updated" &&
      typeof hook.url === "string" &&
      hook.url.startsWith(targetOriginPath)
  );
  const payload = JSON.stringify({
    event: "track_updated",
    url: webhookUrl.toString(),
    active: true,
    is_test: isTestWebhook,
  });

  let action: "already_registered" | "created" | "updated";
  let result: ShippoWebhook;

  if (existing?.object_id) {
    if (
      existing.url === webhookUrl.toString() &&
      existing.active === true &&
      existing.is_test === isTestWebhook
    ) {
      action = "already_registered";
      result = existing;
    } else {
      action = "updated";
      result = await shippoRequest<ShippoWebhook>(
        `/webhooks/${existing.object_id}`,
        {
          method: "PUT",
          body: payload,
        }
      );
    }
  } else {
    action = "created";
    result = await shippoRequest<ShippoWebhook>("/webhooks", {
      method: "POST",
      body: payload,
    });
  }

  console.log(
    JSON.stringify(
      {
        action,
        object_id: result.object_id,
        event: result.event,
        active: result.active,
        is_test: result.is_test,
        url: redactedWebhookUrl,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
