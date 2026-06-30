import assert from "node:assert/strict";
import test from "node:test";
import { FlashClient } from "../dist/index.js";

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status: init.status ?? 200,
    statusText: init.statusText ?? "OK",
  });
}

test("queue client sends RunPod runsync request and wraps job output", async () => {
  const calls = [];
  const client = new FlashClient({
    apiKey: "test-key",
    fetch: async (url, init) => {
      calls.push({ url, init });
      return jsonResponse({ id: "job-1", status: "COMPLETED", output: { text: "ok" } });
    },
  });

  const job = await client.endpoint("endpoint-1").runsync({ prompt: "hello" });

  assert.equal(calls[0].url, "https://api.runpod.ai/v2/endpoint-1/runsync");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers.Authorization, "Bearer test-key");
  assert.deepEqual(JSON.parse(calls[0].init.body), { input: { prompt: "hello" } });
  assert.equal(job.id, "job-1");
  assert.deepEqual(job.output, { text: "ok" });
  assert.equal(job.done, true);
});

test("load-balanced client targets direct endpoint host", async () => {
  const calls = [];
  const client = new FlashClient({
    apiKey: "test-key",
    fetch: async (url, init) => {
      calls.push({ url, init });
      return jsonResponse({ echoed: true });
    },
  });

  const result = await client.endpoint("lb-123").post("/echo", { value: 42 });

  assert.equal(calls[0].url, "https://lb-123.api.runpod.ai/echo");
  assert.equal(calls[0].init.method, "POST");
  assert.deepEqual(JSON.parse(calls[0].init.body), { value: 42 });
  assert.deepEqual(result, { echoed: true });
});

test("client reports RunPod HTTP errors with response detail", async () => {
  const client = new FlashClient({
    apiKey: "test-key",
    fetch: async () => jsonResponse({ error: "bad token" }, { status: 401, statusText: "Unauthorized" }),
  });

  await assert.rejects(() => client.endpoint("endpoint-1").run({}), /401 Unauthorized.*bad token/);
});
