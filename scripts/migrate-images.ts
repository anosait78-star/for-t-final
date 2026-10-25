/**
 * One-off script: uploads every image from the old ASP.NET app's wwwroot/img
 * folder to Cloudinary, and writes a mapping file (old relative path -> new
 * Cloudinary URL) that scripts/migrate-data.ts uses to rewrite image
 * references while copying rows into the new Postgres database.
 *
 * Run locally (not on Vercel):
 *   npx tsx scripts/migrate-images.ts
 *
 * Requires CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
 * in .env, and OLD_IMG_DIR pointing at the old app's wwwroot/img folder.
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

const OLD_IMG_DIR =
  process.env.OLD_IMG_DIR ??
  path.resolve(
    __dirname,
    "../../SportsAcademy-main/SportsAcademy-main/SportsAcademey/wwwroot/img"
  );

const MAPPING_OUTPUT = path.resolve(__dirname, "image-mapping.json");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  const files = await fs.readdir(OLD_IMG_DIR);
  const mapping: Record<string, string> = {};

  console.log(`Found ${files.length} files in ${OLD_IMG_DIR}`);

  for (const file of files) {
    const fullPath = path.join(OLD_IMG_DIR, file);
    const oldRelativePath = `/img/${file}`;

    try {
      const result = await cloudinary.uploader.upload(fullPath, {
        folder: "sportsacademy",
      });
      mapping[oldRelativePath] = result.secure_url;
      console.log(`✔ ${oldRelativePath} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`✘ Failed to upload ${oldRelativePath}:`, err);
    }
  }

  await fs.writeFile(MAPPING_OUTPUT, JSON.stringify(mapping, null, 2));
  console.log(
    `\nDone. Wrote ${Object.keys(mapping).length} mappings to ${MAPPING_OUTPUT}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
