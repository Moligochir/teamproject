import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});
const MODEL =
  "lucataco/clip-vit-base-patch32:056324d6fb78878c1016e432a3827fa76950022848c5378681dd99b7dc7dcc24";
export async function getImageEmbeddingFromURL(imageUrl: string) {
  const output = await replicate.run(MODEL, {
    input: { image: imageUrl },
  });

  return output as number[];
}
// export async function getImageEmbeddingFromURL(
//   imageUrl: string,
// ): Promise<number[]> {
//   const output = await replicate.run(MODEL, { input: { image: imageUrl } });

//   // ✅ Хэрвээ шууд array байвал
//   if (Array.isArray(output)) return output as number[];

//   // ✅ Заримдаа object дотор байж болно (fallback)
//   const maybe =
//     (output as any)?.embedding ??
//     (output as any)?.output ??
//     (output as any)?.vector;
//   if (Array.isArray(maybe)) return maybe as number[];

//   throw new Error("Replicate output is not a number[] embedding");
// }
