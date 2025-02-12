import weaviate, { ApiKey } from "weaviate-ts-client";
import dotenv from "dotenv";

dotenv.config();

export const client = weaviate.client({
  scheme: "https",
  host: "https://atlefruxq9spq9c64mtlq.c0.europe-west3.gcp.weaviate.cloud",
  apiKey: { apiKey: "kbyDJzpwms2K9VDTKhpL51aFxV6iV242XqfT" } as ApiKey,
});
