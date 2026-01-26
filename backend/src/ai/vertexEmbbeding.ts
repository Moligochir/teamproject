import { GoogleAuth } from "google-auth-library";

async function fetchAsBase64(imageUrl: string): Promise<string> {
  const r = await fetch(imageUrl);
  if (!r.ok)
    throw new Error(`Failed to fetch image: ${r.status} ${r.statusText}`);
  const arr = await r.arrayBuffer();
  return Buffer.from(arr).toString("base64");
}

export async function getImageEmbedding(imageUrl: string): Promise<number[]> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!projectId) throw new Error("Missing env GOOGLE_CLOUD_PROJECT_ID");
  if (!credsJson)
    throw new Error("Missing env GOOGLE_APPLICATION_CREDENTIALS_JSON");

  const credentials = JSON.parse(credsJson);

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token?.token) throw new Error("Failed to get access token");

  const b64 = await fetchAsBase64(imageUrl);

  const url =
    `https://${location}-aiplatform.googleapis.com/v1` +
    `/projects/${projectId}/locations/${location}` +
    `/publishers/google/models/multimodalembedding@001:predict`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      instances: [{ image: { bytesBase64Encoded: b64 } }],
    }),
  });

  const data = await resp.json();
  if (!resp.ok)
    throw new Error(
      `Vertex predict failed: ${resp.status} ${JSON.stringify(data)}`,
    );

  const embedding = data?.predictions?.[0]?.imageEmbedding;
  if (!Array.isArray(embedding))
    throw new Error("No imageEmbedding in response");

  return embedding as number[];
}
