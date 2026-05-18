/**
 * Test Shippo tracking webhook locally
 * Run: pnpm exec tsx scripts/test-shippo-webhook.ts
 * Requires: pnpm dev running on localhost:3000, or set SHIPPO_WEBHOOK_TEST_BASE_URL
 */

import { config } from "dotenv";
import { buildShippoWebhookUpdate } from "../src/lib/shippo-webhook";

config({ path: ".env.local" });

const BASE_URL =
  process.env.SHIPPO_WEBHOOK_TEST_BASE_URL ||
  "http://localhost:3000/api/webhooks/shippo";
const WEBHOOK_SECRET = process.env.SHIPPO_WEBHOOK_SECRET;

interface TestCase {
  name: string;
  payload: Record<string, unknown>;
  auth?:
    | "none"
    | "invalid-query"
    | "valid-query"
    | "invalid-bearer"
    | "valid-bearer";
  expectedStatus: number;
}

const TRACKING_NUMBER = "TEST_TRACK_" + Date.now();

const tests: TestCase[] = [
  {
    name: "Reject missing auth",
    payload: {
      event: "track_updated",
      data: { tracking_number: "X", tracking_status: { status: "TRANSIT" } },
    },
    auth: "none",
    expectedStatus: 401,
  },
  {
    name: "Reject invalid auth query token",
    payload: {
      event: "track_updated",
      data: { tracking_number: "X", tracking_status: { status: "TRANSIT" } },
    },
    auth: "invalid-query",
    expectedStatus: 401,
  },
  {
    name: "Reject invalid bearer token",
    payload: {
      event: "track_updated",
      data: { tracking_number: "X", tracking_status: { status: "TRANSIT" } },
    },
    auth: "invalid-bearer",
    expectedStatus: 401,
  },
  {
    name: "Accept valid auth (query param)",
    payload: {
      event: "track_updated",
      data: {
        tracking_number: TRACKING_NUMBER,
        tracking_status: {
          status: "PRE_TRANSIT",
          status_details: "Label created",
          status_date: new Date().toISOString(),
        },
        carrier: "usps",
      },
      test: true,
    },
    auth: "valid-query",
    expectedStatus: 200,
  },
  {
    name: "Accept valid auth (bearer token)",
    payload: {
      event: "track_updated",
      data: {
        tracking_number: TRACKING_NUMBER,
        tracking_status: {
          status: "PRE_TRANSIT",
          status_details: "Label created",
          status_date: new Date().toISOString(),
        },
        carrier: "usps",
      },
      test: true,
    },
    auth: "valid-bearer",
    expectedStatus: 200,
  },
  {
    name: "Ignore unknown event",
    payload: { event: "batch_created", data: {} },
    auth: "valid-query",
    expectedStatus: 200,
  },
  {
    name: "Handle missing tracking data",
    payload: {
      event: "track_updated",
      data: { tracking_number: "", tracking_status: { status: "" } },
    },
    auth: "valid-query",
    expectedStatus: 400,
  },
  {
    name: "Transit update",
    payload: {
      event: "track_updated",
      data: {
        tracking_number: TRACKING_NUMBER,
        tracking_status: {
          status: "TRANSIT",
          status_details: "In transit to destination",
          status_date: new Date().toISOString(),
        },
        carrier: "usps",
      },
      test: true,
    },
    auth: "valid-query",
    expectedStatus: 200,
  },
  {
    name: "Delivered update",
    payload: {
      event: "track_updated",
      data: {
        tracking_number: TRACKING_NUMBER,
        tracking_status: {
          status: "DELIVERED",
          status_details: "Delivered to mailbox",
          status_date: new Date().toISOString(),
        },
        carrier: "usps",
      },
      test: true,
    },
    auth: "valid-query",
    expectedStatus: 200,
  },
  {
    name: "Failure update",
    payload: {
      event: "track_updated",
      data: {
        tracking_number: TRACKING_NUMBER,
        tracking_status: {
          status: "FAILURE",
          status_details: "Carrier exception",
          status_date: new Date().toISOString(),
        },
        carrier: "usps",
      },
      test: true,
    },
    auth: "valid-query",
    expectedStatus: 200,
  },
  {
    name: "Returned update",
    payload: {
      event: "track_updated",
      data: {
        tracking_number: TRACKING_NUMBER,
        tracking_status: {
          status: "RETURNED",
          status_details: "Returned to sender",
          status_date: new Date().toISOString(),
        },
        carrier: "usps",
      },
      test: true,
    },
    auth: "valid-query",
    expectedStatus: 200,
  },
];

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function runTransitionTests() {
  console.log("Shippo webhook transition tests");

  const now = new Date("2026-01-01T00:00:00.000Z");
  const transit = buildShippoWebhookUpdate(
    "processing",
    { status: "TRANSIT" },
    now
  );
  assert(!transit.skipped, "TRANSIT should update processing orders");
  assert(
    transit.updateData?.status === "shipped",
    "TRANSIT should map to shipped"
  );
  assert(
    transit.updateData?.fulfillment_status === "fulfilled",
    "TRANSIT should mark fulfillment fulfilled"
  );

  const deliveredDate = "2026-01-02T12:00:00.000Z";
  const delivered = buildShippoWebhookUpdate(
    "shipped",
    { status: "DELIVERED", status_date: deliveredDate },
    now
  );
  assert(!delivered.skipped, "DELIVERED should update shipped orders");
  assert(
    delivered.updateData?.status === "delivered",
    "DELIVERED should map to delivered"
  );
  assert(
    delivered.updateData?.delivered_at === deliveredDate,
    "DELIVERED should preserve carrier status_date"
  );

  const downgrade = buildShippoWebhookUpdate(
    "delivered",
    { status: "TRANSIT" },
    now
  );
  assert(
    downgrade.skipped && downgrade.reason === "downgrade_protected",
    "TRANSIT must not downgrade delivered orders"
  );

  const failure = buildShippoWebhookUpdate(
    "processing",
    { status: "FAILURE", status_details: "Carrier exception" },
    now
  );
  assert(!failure.skipped, "FAILURE should be accepted");
  assert(
    failure.updateData?.status === "shipped",
    "FAILURE should keep order in shipped state"
  );
  assert(
    String(failure.updateData?.notes).includes("Carrier exception"),
    "FAILURE should write carrier details to notes"
  );

  const returned = buildShippoWebhookUpdate(
    "delivered",
    { status: "RETURNED" },
    now
  );
  assert(!returned.skipped, "RETURNED should be allowed after delivered");
  assert(
    returned.updateData?.status === "returned",
    "RETURNED should map to returned"
  );

  const unknown = buildShippoWebhookUpdate(
    "shipped",
    { status: "UNKNOWN_STATUS" },
    now
  );
  assert(
    unknown.skipped && unknown.reason === "unknown_status",
    "Unknown statuses should be acknowledged without update"
  );

  console.log(
    "  PASS  status mapping, transitions, downgrade protection, failure, returned"
  );
}

function getRequest(test: TestCase): {
  url: string;
  headers: Record<string, string>;
} {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const url = new URL(BASE_URL);

  if (test.auth === "invalid-query") {
    url.searchParams.set("token", "wrong_token");
  }
  if (test.auth === "valid-query") {
    url.searchParams.set("token", WEBHOOK_SECRET!);
  }
  if (test.auth === "invalid-bearer") {
    headers.Authorization = "Bearer wrong_token";
  }
  if (test.auth === "valid-bearer") {
    headers.Authorization = `Bearer ${WEBHOOK_SECRET}`;
  }

  return { url: url.toString(), headers };
}

async function runHttpTests() {
  console.log("\nShippo webhook HTTP tests");
  console.log(`Target: ${BASE_URL}`);
  console.log(`Token:  ${WEBHOOK_SECRET!.slice(0, 8)}...`);
  console.log(`Test tracking#: ${TRACKING_NUMBER}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const { url, headers } = getRequest(test);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(test.payload),
      });

      const body = await res.json().catch(() => ({}));
      const ok = res.status === test.expectedStatus;

      if (ok) {
        console.log(`  PASS  ${test.name} (${res.status})`);
        passed++;
      } else {
        console.log(
          `  FAIL  ${test.name} — expected ${test.expectedStatus}, got ${res.status}`
        );
        console.log(`        Response: ${JSON.stringify(body)}`);
        failed++;
      }
    } catch (err) {
      console.log(
        `  FAIL  ${test.name} — connection error (is dev server running?)`
      );
      console.log(`        ${err}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

async function main() {
  if (!WEBHOOK_SECRET) {
    console.error(
      "Missing SHIPPO_WEBHOOK_SECRET. Add it to .env.local before running webhook tests."
    );
    process.exit(1);
  }

  runTransitionTests();
  await runHttpTests();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
