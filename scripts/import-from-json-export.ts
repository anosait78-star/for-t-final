/**
 * One-off script: imports data exported (via sqlcmd ... FOR JSON) from a
 * local restore of the old SQL Server database into the new Postgres
 * database, rewriting image paths using the mapping produced by
 * migrate-images.ts.
 *
 * This is an alternative to migrate-data.ts for cases where the live old
 * SQL Server host can't be reached directly (e.g. blocked by IP allowlist),
 * but a .bak backup was restored locally and exported to JSON with sqlcmd:
 *
 *   sqlcmd -S "localhost\SQLEXPRESS" -E -C -d <db> -y 0 -f 65001 \
 *     -Q "SET NOCOUNT ON; SELECT * FROM <Table> FOR JSON AUTO, INCLUDE_NULL_VALUES" \
 *     -o scripts/old-data-export/<table>.json
 *
 * Run: npx tsx scripts/import-from-json-export.ts
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../app/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const EXPORT_DIR = path.resolve(__dirname, "old-data-export");
const IMAGE_MAPPING_PATH = path.resolve(__dirname, "image-mapping.json");

async function readJson<T>(file: string): Promise<T> {
  let raw = await fs.readFile(path.join(EXPORT_DIR, file), "utf-8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  // sqlcmd's FOR JSON output is split across multiple result rows/lines;
  // rejoin them before parsing.
  raw = raw.split(/\r?\n/).join("");
  return JSON.parse(raw);
}

async function loadImageMapping(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(IMAGE_MAPPING_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    console.warn("No image-mapping.json found — using old paths as-is.");
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

type OldCoach = {
  Id: number;
  CoachName: string;
  Bio: string | null;
  UrlPicture: string | null;
  CreatedAt: string;
};
type OldCourse = {
  Id: number;
  Course_Name: string;
  Course_Description: string;
  Price: number | null;
  URl_uploaded: string | null;
  date: string;
};
type OldFoundation = {
  Id: number;
  Name: string;
  Url: string | null;
  CreatedAt: string;
};
type OldCertificate = {
  CertificateCode: string;
  StudentName: string;
  CourseName: string;
  NationalNumber: string;
  Date: string;
  StudentPicture: string | null;
  Country: string;
  AccreditedFoundationId: number;
};

async function main() {
  const imageMapping = await loadImageMapping();
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    const coaches = await readJson<OldCoach[]>("coaches.json");
    for (const row of coaches) {
      await prisma.coach.create({
        data: {
          name: row.CoachName,
          bio: row.Bio,
          imageUrl: mapImage(imageMapping, row.UrlPicture),
          createdAt: new Date(row.CreatedAt),
        },
      });
    }
    console.log(`Migrated ${coaches.length} coaches.`);

    const courses = await readJson<OldCourse[]>("courses.json");
    let coursesWithMissingPrice = 0;
    for (const row of courses) {
      if (row.Price == null) coursesWithMissingPrice++;
      await prisma.course.create({
        data: {
          name: row.Course_Name,
          description: row.Course_Description,
          price: row.Price ?? 0,
          imageUrl: mapImage(imageMapping, row.URl_uploaded),
          createdAt: new Date(row.date),
        },
      });
    }
    console.log(`Migrated ${courses.length} courses.`);
    if (coursesWithMissingPrice > 0) {
      console.warn(
        `WARNING: ${coursesWithMissingPrice} course(s) had no price in the old database (predate the Price column) and were set to 0 — review and update them in /admin/courses.`
      );
    }

    const foundations = await readJson<OldFoundation[]>("foundations.json");
    for (const row of foundations) {
      await prisma.accreditedFoundation.create({
        data: {
          id: row.Id,
          name: row.Name,
          imageUrl: mapImage(imageMapping, row.Url),
          createdAt: new Date(row.CreatedAt),
        },
      });
    }
    console.log(`Migrated ${foundations.length} accredited foundations.`);

    const certificates = await readJson<OldCertificate[]>(
      "certificates.json"
    );
    const knownFoundationIds = new Set(foundations.map((f) => f.Id));
    for (const row of certificates) {
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
          date: new Date(row.Date),
          studentPictureUrl: mapImage(imageMapping, row.StudentPicture),
          country: row.Country,
          accreditedFoundationId: row.AccreditedFoundationId,
        },
      });
    }
    console.log(`Migrated ${certificates.length} certificates.`);

    const [newCoaches, newCourses, newFoundations, newCertificates] =
      await Promise.all([
        prisma.coach.count(),
        prisma.course.count(),
        prisma.accreditedFoundation.count(),
        prisma.certificate.count(),
      ]);

    console.log("\n--- Row count comparison (old -> new) ---");
    console.log(`Coaches:      ${coaches.length} -> ${newCoaches}`);
    console.log(`Courses:      ${courses.length} -> ${newCourses}`);
    console.log(`Foundations:  ${foundations.length} -> ${newFoundations}`);
    console.log(
      `Certificates: ${certificates.length} -> ${newCertificates}`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
