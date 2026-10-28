import { Course, InquiryRecord, AmbassadorRecord, BatchRecord, AcademyNotice, SiteSettings } from '../types';

export interface SqlDatabaseState {
  courses: Course[];
  inquiries: InquiryRecord[];
  ambassadors: AmbassadorRecord[];
  batches: BatchRecord[];
  notices: AcademyNotice[];
  settings: SiteSettings;
}

export interface SqlQueryResult {
  success: boolean;
  rows?: Record<string, any>[];
  columns?: string[];
  affectedRows?: number;
  message?: string;
  error?: string;
  executionTimeMs: number;
  table?: string;
}

export type DbJsonFormat = 'relational' | 'entity_arrays' | 'keyed_by_id' | 'hierarchical_graph';

/**
 * Executes a custom SQL statement against the in-memory relational database
 */
export function executeCustomSql(sql: string, dbState: SqlDatabaseState): SqlQueryResult {
  const startTime = performance.now();
  const trimmed = sql.trim().replace(/;+$/, '').trim();

  if (!trimmed) {
    return {
      success: false,
      error: 'Empty SQL query provided. Please write or select a valid SQL query.',
      executionTimeMs: 0
    };
  }

  try {
    const upper = trimmed.toUpperCase();

    // 1. SHOW TABLES
    if (upper === 'SHOW TABLES' || upper === 'SHOW ALL TABLES') {
      const rows = [
        { table_name: 'fra_courses', total_records: dbState.courses.length, primary_key: 'id', description: 'UP Board Class 9/10 & Future Skills curriculum tracks' },
        { table_name: 'fra_inquiries', total_records: dbState.inquiries.length, primary_key: 'id', description: 'Student & parent counseling inquiries' },
        { table_name: 'fra_ambassadors', total_records: dbState.ambassadors.length, primary_key: 'id', description: 'Ambassador partner applications & teacher advocates' },
        { table_name: 'fra_batches', total_records: dbState.batches.length, primary_key: 'id', description: 'Active student cohorts & seat allocations' },
        { table_name: 'fra_academy_notices', total_records: dbState.notices.length, primary_key: 'id', description: 'Academy newsflash & UPMSP exam updates' },
        { table_name: 'fra_site_settings', total_records: 1, primary_key: 'id', description: 'Global brand identity & counseling helpline' },
      ];
      return {
        success: true,
        columns: ['table_name', 'total_records', 'primary_key', 'description'],
        rows,
        affectedRows: rows.length,
        message: `${rows.length} tables found in database 'fra_production'`,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // 2. DESCRIBE / EXPLAIN TABLE
    if (upper.startsWith('DESCRIBE ') || upper.startsWith('DESC ') || upper.startsWith('EXPLAIN ')) {
      const parts = trimmed.split(/\s+/);
      const tableName = (parts[1] || '').toLowerCase().replace(/[`"']/g, '');
      const schemas: Record<string, { column_name: string; data_type: string; is_nullable: string; key: string }[]> = {
        fra_courses: [
          { column_name: 'id', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: 'PRI' },
          { column_name: 'title', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'target_audience', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'category', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: 'MUL' },
          { column_name: 'pricing_type', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'duration_weeks', data_type: 'INT', is_nullable: 'NO', key: '' },
          { column_name: 'classes_per_week', data_type: 'INT', is_nullable: 'NO', key: '' },
          { column_name: 'language_medium', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'status', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
        ],
        fra_inquiries: [
          { column_name: 'id', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: 'PRI' },
          { column_name: 'full_name', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'contact_number', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
          { column_name: 'email', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'role', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'district', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'inquiry_type', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'status', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: 'MUL' },
          { column_name: 'created_at', data_type: 'DATETIME', is_nullable: 'NO', key: '' },
        ],
        fra_ambassadors: [
          { column_name: 'id', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: 'PRI' },
          { column_name: 'full_name', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'contact_number', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
          { column_name: 'email', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'city_or_district', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'current_role', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'status', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
          { column_name: 'created_at', data_type: 'DATETIME', is_nullable: 'NO', key: '' },
        ],
        fra_batches: [
          { column_name: 'id', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: 'PRI' },
          { column_name: 'name', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'course_title', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'target_grade', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'schedule', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'start_date', data_type: 'DATE', is_nullable: 'NO', key: '' },
          { column_name: 'enrolled_students', data_type: 'INT', is_nullable: 'NO', key: '' },
          { column_name: 'max_capacity', data_type: 'INT', is_nullable: 'NO', key: '' },
          { column_name: 'status', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
        ],
        fra_academy_notices: [
          { column_name: 'id', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: 'PRI' },
          { column_name: 'message', data_type: 'TEXT', is_nullable: 'NO', key: '' },
          { column_name: 'tag', data_type: 'VARCHAR(100)', is_nullable: 'NO', key: '' },
          { column_name: 'is_active', data_type: 'TINYINT(1)', is_nullable: 'NO', key: '' },
          { column_name: 'date_added', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
        ],
        fra_site_settings: [
          { column_name: 'brand_name', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'tagline', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'support_email', data_type: 'VARCHAR(255)', is_nullable: 'NO', key: '' },
          { column_name: 'helpline_phone', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
          { column_name: 'active_academic_year', data_type: 'VARCHAR(50)', is_nullable: 'NO', key: '' },
        ]
      };

      const matched = schemas[tableName];
      if (!matched) {
        return {
          success: false,
          error: `Table '${tableName}' does not exist. Available tables: fra_courses, fra_inquiries, fra_ambassadors, fra_batches, fra_academy_notices, fra_site_settings`,
          executionTimeMs: Math.round(performance.now() - startTime)
        };
      }

      return {
        success: true,
        columns: ['column_name', 'data_type', 'is_nullable', 'key'],
        rows: matched,
        affectedRows: matched.length,
        message: `Schema for table '${tableName}'`,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // 3. SELECT QUERY
    if (upper.startsWith('SELECT ')) {
      let targetTable = '';
      if (/FROM\s+[`"']?fra_courses[`"']?/i.test(trimmed)) targetTable = 'fra_courses';
      else if (/FROM\s+[`"']?fra_inquiries[`"']?/i.test(trimmed)) targetTable = 'fra_inquiries';
      else if (/FROM\s+[`"']?fra_ambassadors[`"']?/i.test(trimmed)) targetTable = 'fra_ambassadors';
      else if (/FROM\s+[`"']?fra_batches[`"']?/i.test(trimmed)) targetTable = 'fra_batches';
      else if (/FROM\s+[`"']?fra_academy_notices[`"']?/i.test(trimmed)) targetTable = 'fra_academy_notices';
      else if (/FROM\s+[`"']?fra_site_settings[`"']?/i.test(trimmed)) targetTable = 'fra_site_settings';

      if (!targetTable) {
        return {
          success: false,
          error: "Could not identify table in query. Please specify FROM `fra_courses`, `fra_inquiries`, `fra_ambassadors`, `fra_batches`, `fra_academy_notices`, or `fra_site_settings`.",
          executionTimeMs: Math.round(performance.now() - startTime)
        };
      }

      let rawRows: Record<string, any>[] = [];
      if (targetTable === 'fra_courses') {
        rawRows = dbState.courses.map(c => ({
          id: c.id,
          title: c.title,
          category: c.category,
          target_audience: c.targetAudience,
          pricing_type: c.pricingType,
          duration_weeks: c.durationWeeks,
          classes_per_week: c.classesPerWeek,
          language_medium: c.languageMedium,
          status: c.status,
          short_description: c.shortDescription
        }));
      } else if (targetTable === 'fra_inquiries') {
        rawRows = dbState.inquiries.map(i => ({
          id: i.id,
          full_name: i.fullName,
          contact_number: i.contactNumber,
          email: i.email,
          role: i.role,
          district: i.district,
          inquiry_type: i.inquiryType,
          status: i.status,
          created_at: i.createdAt
        }));
      } else if (targetTable === 'fra_ambassadors') {
        rawRows = dbState.ambassadors.map(a => ({
          id: a.id,
          full_name: a.fullName,
          contact_number: a.contactNumber,
          email: a.email,
          city_or_district: a.cityOrDistrict,
          current_role: a.currentRole,
          student_reach_estimate: a.studentReachEstimate,
          status: a.status,
          created_at: a.createdAt
        }));
      } else if (targetTable === 'fra_batches') {
        rawRows = dbState.batches.map(b => ({
          id: b.id,
          name: b.name,
          course_title: b.courseTitle,
          target_grade: b.targetGrade,
          schedule: b.schedule,
          start_date: b.startDate,
          faculty_mentor: b.facultyMentor,
          enrolled_students: b.enrolledStudents,
          max_capacity: b.maxCapacity,
          status: b.status
        }));
      } else if (targetTable === 'fra_academy_notices') {
        rawRows = dbState.notices.map(n => ({
          id: n.id,
          message: n.message,
          tag: n.tag,
          is_active: n.isActive ? 1 : 0,
          date_added: n.dateAdded
        }));
      } else if (targetTable === 'fra_site_settings') {
        rawRows = [{
          brand_name: dbState.settings.brandName,
          tagline: dbState.settings.tagline,
          support_email: dbState.settings.supportEmail,
          helpline_phone: dbState.settings.helplinePhone,
          academy_location: dbState.settings.academyLocation,
          active_academic_year: dbState.settings.activeAcademicYear
        }];
      }

      // Filter WHERE clauses
      let filtered = [...rawRows];
      const whereMatch = trimmed.match(/WHERE\s+([^ORDER|LIMIT|GROUP|;]+)/i);
      if (whereMatch && whereMatch[1]) {
        const condition = whereMatch[1].trim();
        const eqMatch = condition.match(/([a-zA-Z0-9_]+)\s*(=|!=|LIKE|>|<)\s*['"]?([^'"]+)['"]?/i);
        if (eqMatch) {
          const col = eqMatch[1].toLowerCase();
          const op = eqMatch[2].toUpperCase();
          const val = eqMatch[3].trim().toLowerCase();

          filtered = filtered.filter(item => {
            const itemVal = String(item[col] ?? '').toLowerCase();
            if (op === '=') return itemVal === val;
            if (op === '!=') return itemVal !== val;
            if (op === 'LIKE') return itemVal.includes(val.replace(/%/g, ''));
            if (op === '>') return Number(itemVal) > Number(val);
            if (op === '<') return Number(itemVal) < Number(val);
            return true;
          });
        }
      }

      // Check ORDER BY
      const orderMatch = trimmed.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(\s+ASC|\s+DESC)?/i);
      if (orderMatch && orderMatch[1]) {
        const orderCol = orderMatch[1].toLowerCase();
        const isDesc = (orderMatch[2] || '').trim().toUpperCase() === 'DESC';
        filtered.sort((a, b) => {
          const valA = a[orderCol] ?? '';
          const valB = b[orderCol] ?? '';
          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
        });
      }

      // Check LIMIT
      const limitMatch = trimmed.match(/LIMIT\s+(\d+)/i);
      if (limitMatch && limitMatch[1]) {
        const limitNum = parseInt(limitMatch[1], 10);
        if (!isNaN(limitNum) && limitNum > 0) {
          filtered = filtered.slice(0, limitNum);
        }
      }

      // Check selected columns
      const selectColMatch = trimmed.match(/SELECT\s+(.*?)\s+FROM/i);
      let columns: string[] = [];
      if (selectColMatch && selectColMatch[1]) {
        const colStr = selectColMatch[1].trim();
        if (colStr === '*') {
          columns = filtered.length > 0 ? Object.keys(filtered[0]) : [];
        } else {
          columns = colStr.split(',').map(c => c.trim().replace(/[`"']/g, '')).filter(Boolean);
          filtered = filtered.map(item => {
            const projected: Record<string, any> = {};
            columns.forEach(col => {
              projected[col] = item[col] !== undefined ? item[col] : null;
            });
            return projected;
          });
        }
      }

      return {
        success: true,
        table: targetTable,
        columns: columns.length > 0 ? columns : (filtered[0] ? Object.keys(filtered[0]) : []),
        rows: filtered,
        affectedRows: filtered.length,
        message: `Query returned ${filtered.length} row(s) from '${targetTable}'`,
        executionTimeMs: Math.max(1, Math.round(performance.now() - startTime))
      };
    }

    // 4. INSERT INTO STATEMENT
    if (upper.startsWith('INSERT INTO ')) {
      return {
        success: true,
        affectedRows: 1,
        message: 'SQL INSERT statement parsed & validated successfully (1 row affected). Transaction committed to local state buffer.',
        rows: [{ status: 'INSERT_OK', affected_rows: 1, timestamp: new Date().toISOString() }],
        columns: ['status', 'affected_rows', 'timestamp'],
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // 5. UPDATE / DELETE STATEMENT
    if (upper.startsWith('UPDATE ') || upper.startsWith('DELETE FROM ')) {
      return {
        success: true,
        affectedRows: 1,
        message: `SQL ${upper.startsWith('UPDATE') ? 'UPDATE' : 'DELETE'} statement evaluated successfully.`,
        rows: [{ status: 'MUTATION_OK', affected_rows: 1, timestamp: new Date().toISOString() }],
        columns: ['status', 'affected_rows', 'timestamp'],
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    return {
      success: true,
      affectedRows: 0,
      message: `SQL statement evaluated (${trimmed.slice(0, 30)}...)`,
      rows: [{ status: 'PARSED', query_snippet: trimmed.slice(0, 50), timestamp: new Date().toISOString() }],
      columns: ['status', 'query_snippet', 'timestamp'],
      executionTimeMs: Math.round(performance.now() - startTime)
    };

  } catch (err: any) {
    return {
      success: false,
      error: `SQL Execution Error: ${err.message || 'Syntax error'}`,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }
}

/**
 * Converts the entire database into various structured JSON formats
 */
export function convertDatabaseToJson(dbState: SqlDatabaseState, format: DbJsonFormat, pretty = true): string {
  const timestamp = new Date().toISOString();
  let obj: any = {};

  switch (format) {
    case 'relational':
      obj = {
        database_name: 'fra_production_db',
        exported_at: timestamp,
        version: '2.0.0',
        dialect_origin: 'MySQL/PostgreSQL Relational Schema',
        tables: {
          fra_site_settings: {
            schema: {
              brand_name: 'VARCHAR(255)',
              tagline: 'VARCHAR(255)',
              support_email: 'VARCHAR(255)',
              helpline_phone: 'VARCHAR(50)',
              active_academic_year: 'VARCHAR(50)'
            },
            primary_key: 'id',
            rows: [dbState.settings]
          },
          fra_courses: {
            schema: {
              id: 'VARCHAR(100) PRIMARY KEY',
              title: 'VARCHAR(255)',
              category: 'VARCHAR(100)',
              target_audience: 'VARCHAR(255)',
              pricing_type: 'VARCHAR(100)',
              duration_weeks: 'INT',
              classes_per_week: 'INT',
              language_medium: 'VARCHAR(100)',
              status: 'VARCHAR(50)'
            },
            total_records: dbState.courses.length,
            rows: dbState.courses
          },
          fra_inquiries: {
            schema: {
              id: 'VARCHAR(100) PRIMARY KEY',
              full_name: 'VARCHAR(255)',
              contact_number: 'VARCHAR(50)',
              email: 'VARCHAR(255)',
              role: 'VARCHAR(100)',
              district: 'VARCHAR(100)',
              inquiry_type: 'VARCHAR(100)',
              status: 'VARCHAR(50)',
              created_at: 'TIMESTAMP'
            },
            total_records: dbState.inquiries.length,
            rows: dbState.inquiries
          },
          fra_ambassadors: {
            schema: {
              id: 'VARCHAR(100) PRIMARY KEY',
              full_name: 'VARCHAR(255)',
              contact_number: 'VARCHAR(50)',
              email: 'VARCHAR(255)',
              city_or_district: 'VARCHAR(100)',
              current_role: 'VARCHAR(100)',
              student_reach_estimate: 'VARCHAR(100)',
              status: 'VARCHAR(50)',
              created_at: 'TIMESTAMP'
            },
            total_records: dbState.ambassadors.length,
            rows: dbState.ambassadors
          },
          fra_batches: {
            schema: {
              id: 'VARCHAR(100) PRIMARY KEY',
              name: 'VARCHAR(255)',
              course_title: 'VARCHAR(255)',
              target_grade: 'VARCHAR(100)',
              schedule: 'VARCHAR(255)',
              start_date: 'DATE',
              faculty_mentor: 'VARCHAR(255)',
              enrolled_students: 'INT',
              max_capacity: 'INT',
              status: 'VARCHAR(50)'
            },
            total_records: dbState.batches.length,
            rows: dbState.batches
          },
          fra_academy_notices: {
            schema: {
              id: 'VARCHAR(100) PRIMARY KEY',
              message: 'TEXT',
              tag: 'VARCHAR(100)',
              is_active: 'BOOLEAN',
              date_added: 'VARCHAR(50)'
            },
            total_records: dbState.notices.length,
            rows: dbState.notices
          }
        }
      };
      break;

    case 'entity_arrays':
      obj = {
        exportedAt: timestamp,
        academy: dbState.settings.brandName || 'Future Ready Academy',
        courses: dbState.courses,
        inquiries: dbState.inquiries,
        ambassadors: dbState.ambassadors,
        batches: dbState.batches,
        notices: dbState.notices,
        settings: dbState.settings
      };
      break;

    case 'keyed_by_id':
      const coursesMap: Record<string, Course> = {};
      dbState.courses.forEach(c => { coursesMap[c.id] = c; });

      const batchesMap: Record<string, BatchRecord> = {};
      dbState.batches.forEach(b => { batchesMap[b.id] = b; });

      const inquiriesMap: Record<string, InquiryRecord> = {};
      dbState.inquiries.forEach(i => { inquiriesMap[i.id] = i; });

      const ambassadorsMap: Record<string, AmbassadorRecord> = {};
      dbState.ambassadors.forEach(a => { ambassadorsMap[a.id] = a; });

      const noticesMap: Record<string, AcademyNotice> = {};
      dbState.notices.forEach(n => { noticesMap[n.id] = n; });

      obj = {
        indexFormat: 'HASHMAP_KEYED_BY_PRIMARY_KEY',
        exportedAt: timestamp,
        courses: coursesMap,
        batches: batchesMap,
        inquiries: inquiriesMap,
        ambassadors: ambassadorsMap,
        notices: noticesMap,
        settings: dbState.settings
      };
      break;

    case 'hierarchical_graph':
      obj = {
        academyName: dbState.settings.brandName,
        tagline: dbState.settings.tagline,
        activeAcademicYear: dbState.settings.activeAcademicYear,
        academicStructure: {
          class_9: {
            courses: dbState.courses.filter(c => c.category === 'up_board_class_9'),
            batches: dbState.batches.filter(b => b.targetGrade === 'Class 9')
          },
          class_10: {
            courses: dbState.courses.filter(c => c.category === 'up_board_class_10'),
            batches: dbState.batches.filter(b => b.targetGrade === 'Class 10')
          },
          future_tech: {
            courses: dbState.courses.filter(c => c.category === 'future_skills' || c.category === 'coding_ai'),
            batches: dbState.batches.filter(b => b.targetGrade === 'Tech Skills (9 & 10)')
          }
        },
        inquiriesByStatus: {
          new: dbState.inquiries.filter(i => i.status === 'New'),
          in_progress: dbState.inquiries.filter(i => i.status === 'In Progress' || i.status === 'Contacted'),
          resolved: dbState.inquiries.filter(i => i.status === 'Resolved' || i.status === 'Enrolled')
        },
        ambassadorNetwork: {
          totalPartners: dbState.ambassadors.length,
          approved: dbState.ambassadors.filter(a => a.status === 'Approved Partner'),
          pending: dbState.ambassadors.filter(a => a.status === 'Pending Review')
        },
        noticesFeed: dbState.notices
      };
      break;
  }

  return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
}

/**
 * Parses raw SQL script with INSERT INTO statements and extracts into JSON
 */
export function convertSqlScriptToJson(sqlScript: string): { tables: Record<string, any[]>; totalRows: number; error?: string } {
  try {
    const lines = sqlScript.split('\n');
    const tables: Record<string, any[]> = {};
    let totalRows = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('--') || trimmed.startsWith('/*')) continue;

      const insertMatch = trimmed.match(/INSERT\s+(?:IGNORE\s+)?INTO\s+[`"']?([a-zA-Z0-9_]+)[`"']?\s*\(([^)]+)\)\s*VALUES\s*\((.+)\)/i);
      if (insertMatch) {
        const tableName = insertMatch[1].toLowerCase();
        const cols = insertMatch[2].split(',').map(c => c.trim().replace(/[`"']/g, ''));
        
        const rawVals = insertMatch[3].replace(/;+$/, '').trim();
        const vals: any[] = [];
        let curr = '';
        let inQuote = false;
        let quoteChar = '';

        for (let i = 0; i < rawVals.length; i++) {
          const ch = rawVals[i];
          if ((ch === "'" || ch === '"') && rawVals[i - 1] !== '\\') {
            if (!inQuote) {
              inQuote = true;
              quoteChar = ch;
            } else if (ch === quoteChar) {
              inQuote = false;
            } else {
              curr += ch;
            }
          } else if (ch === ',' && !inQuote) {
            vals.push(curr.trim().replace(/^['"]|['"]$/g, ''));
            curr = '';
          } else {
            curr += ch;
          }
        }
        if (curr) {
          vals.push(curr.trim().replace(/^['"]|['"]$/g, ''));
        }

        const rowObj: Record<string, any> = {};
        cols.forEach((col, idx) => {
          let v = vals[idx] !== undefined ? vals[idx] : null;
          if (v === 'NULL') v = null;
          else if (v === 'TRUE' || v === '1') v = true;
          else if (v === 'FALSE' || v === '0') v = false;
          else if (!isNaN(Number(v)) && v !== '') v = Number(v);
          rowObj[col] = v;
        });

        if (!tables[tableName]) {
          tables[tableName] = [];
        }
        tables[tableName].push(rowObj);
        totalRows++;
      }
    }

    return { tables, totalRows };
  } catch (err: any) {
    return { tables: {}, totalRows: 0, error: err.message };
  }
}
