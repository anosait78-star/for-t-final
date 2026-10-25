/**
 * One-off script: copies all data from the old ASP.NET app's SQL Server
 * database into the new Postgres database, in dependency order, rewriting
 * image paths using the mapping produced by scripts/migrate-images.ts.
 *
 * Run locally (not on Vercel), AFTER migrate-images.ts and AFTER
 * `prisma migrate deploy` has created the new schema:
 *   npx tsx scripts/migrate-data.ts
 *
 * Requires:
 *   - OLD_DB_CONNECTION_STRING: the old SQL Server connection string
 *   - DATABASE_URL: the new Postgres connection string (used by Prisma)
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import sql from "mssql";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../app/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const IMAGE_MAPPING_PATH = path.resolve(__dirname, "image-mapping.json");

async function loadImageMapping(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(IMAGE_MAPPING_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    console.warn(
      "No image-mapping.json found — run migrate-images.ts first if you want images carried over. Continuing with old paths as-is."
    );
    return {};
  }
}

function mapImage(
  mapping: Record<string, string>,
  oldPath: string | null
): string | null {
  if (!oldPath) return null;
  return mapping[oldPath] ?? oldPath;
}

async function main() {
  const oldDbConnectionString = process.env.OLD_DB_CONNECTION_STRING;
  if (!oldDbConnectionString) {
    throw new Error(
      "OLD_DB_CONNECTION_STRING environment variable is not set."
    );
  }

  const newDbConnectionString = process.env.DATABASE_URL;
  if (!newDbConnectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const imageMapping = await loadImageMapping();
  const adapter = new PrismaNeon({ connectionString: newDbConnectionString });
  const prisma = new PrismaClient({ adapter });
  const oldDb = await sql.connect(oldDbConnectionString);

  try {
    // Step A: Coaches
    const coachRows = await oldDb.query(
      `SELECT Id, CoachName, Bio, UrlPicture, CreatedAt FROM Coaches`
    );
    for (const row of coachRows.recordset) {
      await prisma.coach.create({
        data: {
          name: row.CoachName,
          bio: row.Bio,
          imageUrl: mapImage(imageMapping, row.UrlPicture),
          createdAt: row.CreatedAt,
        },
      });
    }
    console.log(`Migrated ${coachRows.recordset.length} coaches.`);

    // Step B: Courses
    const courseRows = await oldDb.query(
      `SELECT Id, Course_Name, Course_Description, Price, URl_uploaded, date FROM Courses`
    );
    for (const row of courseRows.recordset) {
      await prisma.course.create({
        data: {
          name: row.Course_Name,
          description: row.Course_Description,
          price: row.Price,
          imageUrl: mapImage(imageMapping, row.URl_uploaded),
          createdAt: row.date,
        },
      });
    }
    console.log(`Migrated ${courseRows.recordset.length} courses.`);

    // Step C: Accredited Foundations — preserve original IDs (Certificate FK depends on them)
    const foundationRows = await oldDb.query(
      `SELECT Id, Name, Url, CreatedAt FROM AccreditedFoundation`
    );
    for (const row of foundationRows.recordset) {
      await prisma.accreditedFoundation.create({
        data: {
          id: row.Id,
          name: row.Name,
          imageUrl: mapImage(imageMapping, row.Url),
          createdAt: row.CreatedAt,
        },
      });
    }
    console.log(
      `Migrated ${foundationRows.recordset.length} accredited foundations.`
    );

    // Step D: Certificates — must resolve AccreditedFoundationId or hard-fail
    const certificateRows = await oldDb.query(
      `SELECT CertificateCode, StudentName, CourseName, NationalNumber, Date, StudentPicture, Country, AccreditedFoundationId FROM Certificates`
    );
    const knownFoundationIds = new Set(
      foundationRows.recordset.map((r: { Id: number }) => r.Id)
    );
    for (const row of certificateRows.recordset) {
      if (!knownFoundationIds.has(row.AccreditedFoundationId)) {
        throw new Error(
          `Certificate ${row.CertificateCode} references AccreditedFoundationId ${row.AccreditedFoundationId}, which was not migrated. Aborting.`
        );
      }
      await prisma.certificate.create({
        data: {
          certificateCode: row.CertificateCode,
          studentName: row.StudentName,
          courseName: row.CourseName,
          nationalNumber: row.NationalNumber,
          date: row.Date,
          studentPictureUrl: mapImage(imageMapping, row.StudentPicture),
          country: row.Country,
          accreditedFoundationId: row.AccreditedFoundationId,
        },
      });
    }
    console.log(`Migrated ${certificateRows.recordset.length} certificates.`);

    // Verification pass
    const [newCoaches, newCourses, newFoundations, newCertificates] =
      await Promise.all([
        prisma.coach.count(),
        prisma.course.count(),
        prisma.accreditedFoundation.count(),
        prisma.certificate.count(),
      ]);

    console.log("\n--- Row count comparison (old -> new) ---");
    console.log(`Coaches:      ${coachRows.recordset.length} -> ${newCoaches}`);
    console.log(`Courses:      ${courseRows.recordset.length} -> ${newCourses}`);
    console.log(
      `Foundations:  ${foundationRows.recordset.length} -> ${newFoundations}`
    );
    console.log(
      `Certificates: ${certificateRows.recordset.length} -> ${newCertificates}`
    );
  } finally {
    await oldDb.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
