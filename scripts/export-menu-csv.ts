import path from "node:path";
import { menu } from "../src/data/menu";
import { menuToCsv } from "./menu-csv";

const ROOT = path.join(import.meta.dir, "..");
const outPath = process.argv[2] ?? path.join(ROOT, "menu", "menu.csv");

await Bun.write(outPath, menuToCsv(menu));
console.log(`wrote ${outPath}`);
