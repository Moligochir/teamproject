import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export async function getEmbedding(imagePath: string): Promise<number[]> {
  const form = new FormData();
  form.append("file", fs.createReadStream(imagePath));

  const res = await axios.post(
    "http://localhost:8000/embed",
    form,
    { headers: form.getHeaders() }
  );

  return res.data.embedding;
}
