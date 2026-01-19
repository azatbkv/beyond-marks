import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 1. Get the directory of the current script (project-root/scripts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Resolve paths relative to this script
// Go up one level (scripts -> root) then into 'olympiads'
const BASE_DIR = path.resolve(__dirname, '../olympiads'); 

// Output seed.sql to the project root
const OUTPUT_FILE = path.resolve(__dirname, '../seed.sql');
// Helper to escape single quotes for SQL: O'Neil -> O''Neil
const esc = (str: string | number | null | undefined) => {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return str;
  return `'${String(str).replace(/'/g, "''")}'`;
};

// Helper to stringify JSON objects for SQL storage
const escJson = (obj: any) => {
  return esc(JSON.stringify(obj));
};

async function main() {
  const statements: string[] = [];

  // 1. Validate Dir
  try {
    await fs.access(BASE_DIR);
  } catch {
    console.error(`Error: Could not find folder at ${BASE_DIR}`);
    process.exit(1);
  }

  // 2. Walk the directory tree
  const subjectDirs = await getDirectories(BASE_DIR);

  for (const subjectName of subjectDirs) {
    // SQL: Upsert Subject
    statements.push(`
      INSERT INTO subjects (name, nameLower) 
      VALUES (${esc(subjectName)}, ${esc(subjectName.toLowerCase())})
      ON CONFLICT(name) DO NOTHING;
    `);

    const subjectPath = path.join(BASE_DIR, subjectName);
    const olympiadDirs = await getDirectories(subjectPath);

    for (const olympiadName of olympiadDirs) {
      // SQL: Upsert Olympiad (Using subquery for subject_id)
      statements.push(`
        INSERT INTO olympiads (name, nameLower, subjectId) 
        VALUES (
          ${esc(olympiadName)}, 
          ${esc(olympiadName.toLowerCase())},
          (SELECT id FROM subjects WHERE name = ${esc(subjectName)})
        )
        ON CONFLICT(name, subjectId) DO NOTHING;
      `);

      const olympiadPath = path.join(subjectPath, olympiadName);
      const yearDirs = await getDirectories(olympiadPath);

      for (const yearStr of yearDirs) {
        const yearInt = parseInt(yearStr, 10);
        if (isNaN(yearInt)) continue;

        // SQL: Upsert Year (Using subquery for olympiad_id)
        // Note: This assumes olympiad names are unique within a subject.
        statements.push(`
          INSERT INTO years (date, olympiadId) 
          VALUES (
            ${yearInt}, 
            (SELECT id FROM olympiads WHERE name = ${esc(olympiadName)} AND subjectId = (SELECT id FROM subjects WHERE name = ${esc(subjectName)}))
          )
          ON CONFLICT(date, olympiadId) DO NOTHING;
        `);

        const yearPath = path.join(olympiadPath, yearStr);
        const files = await getFiles(yearPath);

        for (const file of files) {
          if (!file.endsWith('.json')) continue;

          // Determine Grade
          let gradeVal: string | null = null;
          let gradeSubQuery = 'NULL';

          if (file !== 'problems.json') {
            gradeVal = path.parse(file).name; // e.g., "10" from "10.json"
          }

          // Define reusable SQL snippets for IDs
          const subjectIdSql = `(SELECT id FROM subjects WHERE name = ${esc(subjectName)})`;
          const olympiadIdSql = `(SELECT id FROM olympiads WHERE name = ${esc(olympiadName)} AND subjectId = ${subjectIdSql})`;
          const yearIdSql = `(SELECT id FROM years WHERE date = ${yearInt} AND olympiadId = ${olympiadIdSql})`;

          // SQL: Upsert Grade (if exists)
          if (gradeVal) {
            statements.push(`
              INSERT INTO grades (grade, yearId) 
              VALUES (
                ${esc(gradeVal)}, 
                ${yearIdSql}
              )
              ON CONFLICT(grade, yearId) DO NOTHING;
            `);
            gradeSubQuery = `(SELECT id FROM grades WHERE grade = ${esc(gradeVal)} AND yearId = ${yearIdSql})`;
          }

          // Process Problems
          const filePath = path.join(yearPath, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          
          try {
            const problems = JSON.parse(fileContent);
            
            for (const p of problems) {
              // We assume you have a unique constraint on problems: (yearId, gradeId, number)
              // If not, 'ON CONFLICT' won't work and you'll get duplicates.
              statements.push(`
                INSERT INTO problems (number, name, maxPoints, weightedMaxPoints, parts, yearId, gradeId)
                VALUES (
                  ${esc(p.number)}, 
                  ${esc(p.name)}, 
                  ${esc(p.maxPoints)}, 
                  ${esc(p.weightedMaxPoints)}, 
                  ${escJson(p.parts)}, 
                  ${yearIdSql}, 
                  ${gradeSubQuery}
                )
                ON CONFLICT(yearId, gradeId, number) DO UPDATE SET
                  name = excluded.name,
                  maxPoints = excluded.maxPoints,
                  parts = excluded.parts;
              `);
            }
          } catch (e) {
            console.error(`Failed to parse JSON in ${filePath}`);
          }
        }
      }
    }
  }

  await fs.writeFile(OUTPUT_FILE, statements.join('\n'));
  console.log(`Generated seed.sql with ${statements.length} commands.`);
}

async function getDirectories(source: string) {
  const dirents = await fs.readdir(source, { withFileTypes: true });
  return dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
}

async function getFiles(source: string) {
  const dirents = await fs.readdir(source, { withFileTypes: true });
  return dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
}

main();
