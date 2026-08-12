import assert from "node:assert/strict";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };

test("server-renders the Manabu learning dashboard", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Manabu — Học tiếng Nhật theo cụm<\/title>/i);
  assert.match(html, /MANABU/);
  assert.match(html, /Học theo cụm/);
  assert.match(html, /Chọn một bài để bắt đầu/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("edge API mirrors the read-only learning data", async () => {
  const worker = await getWorker();
  const lessonsResponse = await worker.fetch(
    new Request("http://localhost/api/lessons"),
    env,
    ctx,
  );
  assert.equal(lessonsResponse.status, 200);
  assert.equal((await lessonsResponse.json()).length, 50);

  const sentencesResponse = await worker.fetch(
    new Request("http://localhost/api/lessons/1/sentences"),
    env,
    ctx,
  );
  const sentences = await sentencesResponse.json();
  assert.equal(sentencesResponse.status, 200);
  assert.equal(sentences.length, 3);
  assert.deepEqual(
    sentences[0].chunks.map((chunk) => chunk.order_index),
    [1, 2, 3],
  );
});

