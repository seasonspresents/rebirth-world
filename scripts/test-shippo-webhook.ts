/**
 * Test Shippo tracking webhook locally
 * Run: npx tsx scripts/test-shippo-webhook.ts
 * Requires: pnpm dev running on localhost:3000
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const BASE_URL = "http://localhost:3000/api/webhooks/shippo";
const WEBHOOK_SECRET = process.env.SHIPPO_WEBHOOK_SECRET!;

interface TestCase {
  name: string;
  payload: Record<string, unknown>;
  token?: string;
  expectedStatus: number;
}

const TRACKING_NUMBER = "TEST_TRACK_" + Date.now();

const tests: TestCase[] = [
  {
    name: "Reject missing auth",
    payload: { event: "track_updated", data: { tracking_number: "X", tracking_status: { status: "TRANSIT" } } },
    token: "wrong_token",
    expectedStatus: 401,
  },
  {
    name: "Accept valid auth (query param)",
    payload: { event: "track_updated", data: { tracking_number: TRACKING_NUMBER, tracking_status: { status: "PRE_TRANSIT", status_details: "Label created", status_date: new Date().toISOString() }, carrier: "usps" }, test: true },
    token: WEBHOOK_SECRET,
    expectedStatus: 200,
  },
  {
    name: "Ignore unknown event",
    payload: { event: "batch_created", data: {} },
    token: WEBHOOK_SECRET,
    expectedStatus: 200,
  },
  {
    name: "Handle missing tracking data",
    payload: { event: "track_updated", data: { tracking_number: "", tracking_status: { status: "" } } },
    token: WEBHOOK_SECRET,
    expectedStatus: 400,
  },
  {
    name: "Transit update",
    payload: { event: "track_updated", data: { tracking_number: TRACKING_NUMBER, tracking_status: { status: "TRANSIT", status_details: "In transit to destination", status_date: new Date().toISOString() }, carrier: "usps" }, test: true },
    token: WEBHOOK_SECRET,
    expectedStatus: 200,
  },
  {
    name: "Delivered update",
    payload: { event: "track_updated", data: { tracking_number: TRACKING_NUMBER, tracking_status: { status: "DELIVERED", status_details: "Delivered to mailbox", status_date: new Date().toISOString() }, carrier: "usps" }, test: true },
    token: WEBHOOK_SECRET,
    expectedStatus: 200,
  },
];

async function runTests() {
  console.log("Shippo Webhook Test Suite");
  console.log(`Target: ${BASE_URL}`);
  console.log(`Token:  ${WEBHOOK_SECRET.slice(0, 8)}...`);
  console.log(`Test tracking#: ${TRACKING_NUMBER}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const url = test.token ? `${BASE_URL}?token=${test.token}` : BASE_URL;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test.payload),
      });

      const body = await res.json().catch(() => ({}));
      const ok = res.status === test.expectedStatus;

      if (ok) {
        console.log(`  PASS  ${test.name} (${res.status})`);
        passed++;
      } else {
        console.log(`  FAIL  ${test.name} — expected ${test.expectedStatus}, got ${res.status}`);
        console.log(`        Response: ${JSON.stringify(body)}`);
        failed++;
      }
    } catch (err) {
      console.log(`  FAIL  ${test.name} — connection error (is dev server running?)`);
      console.log(`        ${err}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
