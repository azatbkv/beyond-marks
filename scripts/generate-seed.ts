import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 1. Setup Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '../olympiads'); 
const OUTPUT_FILE = path.resolve(__dirname, '../seed.sql');

// Helper to escape single quotes for SQL
const esc = (str: string | number | null | undefined) => {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return str;
  return `'${String(str).replace(/'/g, "''")}'`;
};

// Helper for JSON columns
const escJson = (obj: any) => esc(JSON.stringify(obj));

async function main() {
  const statements: string[] = [];
  
  // Start transaction for speed and safety
  statements.push('BEGIN TRANSACTION;');

  const subjectDirs = await getDirectories(BASE_DIR);

  for (const subjectName of subjectDirs) {
    const sLower = subjectName.toLowerCase();
    
    // 1. Upsert Subject
    statements.push(`INSERT INTO subjects (name, name_lower) VALUES (${esc(subjectName)}, ${esc(sLower)}) ON CONFLICT(name_lower) DO NOTHING;`);

    // Reference for Subject ID lookup
    const subjectIdSql = `(SELECT id FROM subjects WHERE name_lower = ${esc(sLower)})`;

    const subjectPath = path.join(BASE_DIR, subjectName);
    const olympiadDirs = await getDirectories(subjectPath);

    for (const olympiadName of olympiadDirs) {
      const oLower = olympiadName.toLowerCase();

      // 2. Upsert Olympiad
      statements.push(`
        INSERT INTO olympiads (name, name_lower, subject_id) 
        VALUES (${esc(olympiadName)}, ${esc(oLower)}, ${subjectIdSql})
        ON CONFLICT(name_lower, subject_id) DO NOTHING;
      `);

      const olympiadIdSql = `(SELECT id FROM olympiads WHERE name_lower = ${esc(oLower)} AND subject_id = ${subjectIdSql})`;

      const olympiadPath = path.join(subjectPath, olympiadName);
      const yearDirs = await getDirectories(olympiadPath);

      for (const yearStr of yearDirs) {
        const yearInt = parseInt(yearStr, 10);
        if (isNaN(yearInt)) continue;

        // 3. Upsert Year
        statements.push(`
          INSERT INTO years (date, olympiad_id) 
          VALUES (${yearInt}, ${olympiadIdSql})
          ON CONFLICT(date, olympiad_id) DO NOTHING;
        `);

        const yearIdSql = `(SELECT id FROM years WHERE date = ${yearInt} AND olympiad_id = ${olympiadIdSql})`;

        const yearPath = path.join(olympiadPath, yearStr);
        const files = await getFiles(yearPath);

        for (const file of files) {
          if (!file.endsWith('.json')) continue;

          let gradeVal: string | null = null;
          let gradeIdSql = 'NULL';

          // 4. Handle Grades
          if (file !== 'problems.json') {
            gradeVal = path.parse(file).name;
            statements.push(`
              INSERT INTO grades (grade, year_id) 
              VALUES (${esc(gradeVal)}, ${yearIdSql})
              ON CONFLICT(grade, year_id) DO NOTHING;
            `);
            gradeIdSql = `(SELECT id FROM grades WHERE grade = ${esc(gradeVal)} AND year_id = ${yearIdSql})`;
          }

          // 5. Upsert Problems
          const filePath = path.join(yearPath, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          
          try {
            const problemsData = JSON.parse(fileContent);
            
            for (const p of problemsData) {
              // Based on your unique constraint: (number, gradeId, yearId)
              statements.push(`
                INSERT INTO problems (number, name, max_points, weighted_max_points, parts, grade_id, year_id)
                VALUES (
                  ${esc(p.number)}, 
                  ${esc(p.name)}, 
                  ${esc(p.maxPoints)}, 
                  ${esc(p.weightedMaxPoints)}, 
                  ${escJson(p.parts)}, 
                  ${gradeIdSql}, 
                  ${yearIdSql}
                )
                ON CONFLICT(number, grade_id, year_id) DO UPDATE SET
                  name = excluded.name,
                  max_points = excluded.max_points,
                  weighted_max_points = excluded.weighted_max_points,
                  parts = excluded.parts;
              `);
            }
          } catch (e) {
            console.error(`Error parsing ${filePath}:`, e);
          }
        }
      }
    }
  }

  statements.push('COMMIT;');
  await fs.writeFile(OUTPUT_FILE, statements.join('\n'));
  console.log(`SQL generated at ${OUTPUT_FILE}`);
}

async function getDirectories(source: string) {
  try {
    const dirents = await fs.readdir(source, { withFileTypes: true });
    return dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
  } catch { return []; }
}

async function getFiles(source: string) {
  try {
    const dirents = await fs.readdir(source, { withFileTypes: true });
    return dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
  } catch { return []; }
}

main();
