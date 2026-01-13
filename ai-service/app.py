from fastapi import FastAPI, UploadFile, File
from PIL import Image
import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel
import io

app = FastAPI()

# 🔹 CLIP model load (startup дээр 1 удаа)
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()


def image_to_embedding(image: Image.Image):
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model.get_image_features(**inputs)

    embedding = outputs[0].cpu().numpy()
    embedding = embedding / np.linalg.norm(embedding)  # normalize
    return embedding.tolist()


@app.post("/embed")
async def embed_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    embedding = image_to_embedding(image)

    return {
        "embedding": embedding,
        "dimension": len(embedding)
    }
