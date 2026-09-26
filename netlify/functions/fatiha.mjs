import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "fatiha", consistency: "strong" });

  if (req.method === "POST") {
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await store.set(key, "1");
  } else if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  let count = 0;
  for await (const page of store.list({ paginate: true })) {
    count += page.blobs.length;
  }

  return Response.json({ count }, { headers: { "Cache-Control": "no-store" } });
};

export const config = { path: "/api/fatiha" };
