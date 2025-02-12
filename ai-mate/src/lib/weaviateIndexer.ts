import { client } from "./weaviateClient";
import { parseCSV } from "./csvParser";

export async function indexData(csvPath: string) {
  const data = await parseCSV(csvPath) as { name: string; description: string; price: string; category: string }[];

  for (const item of data) {
    const obj = {
      class: "Abakus",
      properties: {
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        category: item.category,
      },
    };

    await client.data.creator().withClassName("Abakus").withProperties(obj.properties).do();
  }
  console.log("Data lastet opp!");
}
