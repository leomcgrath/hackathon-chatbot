import fs from "fs";
import Papa from "papaparse";

export async function parseCSV(filePath: string) {
  const file = fs.readFileSync(filePath, "utf-8");
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: any) => reject(err),
    });
  });
}
