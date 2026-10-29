import { Column, RowData } from '../types';

/**
 * Detect delimiter in raw CSV/TSV text (comma, tab, semicolon)
 */
export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r\n|\n|\r/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  if (tabCount > commaCount && tabCount > semiCount) return '\t';
  if (semiCount > commaCount) return ';';
  return ',';
}

/**
 * Parse CSV or TSV string into columns and rows
 */
export function parseCSV(csvText: string): { columns: Column[]; rows: RowData[]; error?: string } {
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) {
    return { columns: [], rows: [], error: 'Tệp rỗng hoặc không có dữ liệu văn bản.' };
  }

  const delimiter = detectDelimiter(cleanText);
  const lines = cleanText.split(/\r\n|\n|\r/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { columns: [], rows: [], error: 'Tệp không chứa dòng dữ liệu nào.' };
  }

  // Helper to split row respecting quotes
  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const rawHeaders = parseLine(lines[0]);
  if (rawHeaders.length === 0 || rawHeaders.every((h) => !h)) {
    return { columns: [], rows: [], error: 'Dòng tiêu đề đầu tiên không hợp lệ.' };
  }

  const dataRows: RowData[] = [];
  const columnSampleValues: Record<string, string[]> = {};

  // Build column definitions
  const columns: Column[] = rawHeaders.map((header, index) => {
    const colId = `col_${Date.now()}_${index}`;
    columnSampleValues[colId] = [];
    const cleanHeader = header || `Cột ${index + 1}`;
    return {
      id: colId,
      name: cleanHeader,
      type: 'categorical', // Temporary, will be inferred
    };
  });

  // Parse remaining lines
  for (let r = 1; r < lines.length; r++) {
    const rowValues = parseLine(lines[r]);
    // Skip empty lines
    if (rowValues.length === 1 && !rowValues[0]) continue;

    const rowObj: RowData = {
      id: `row_${Date.now()}_${r}_${Math.random().toString(36).substring(2, 6)}`,
    };

    columns.forEach((col, idx) => {
      const rawVal = rowValues[idx] !== undefined ? rowValues[idx].trim() : '';
      rowObj[col.id] = rawVal;
      if (rawVal !== '') {
        columnSampleValues[col.id].push(rawVal);
      }
    });

    dataRows.push(rowObj);
  }

  // Infer column type: if >= 70% of non-empty values are valid numbers, mark quantitative
  columns.forEach((col) => {
    const samples = columnSampleValues[col.id];
    if (samples && samples.length > 0) {
      let numCount = 0;
      for (const val of samples) {
        const parsed = Number(val.replace(',', '.'));
        if (!isNaN(parsed) && isFinite(parsed)) {
          numCount++;
        }
      }
      if (numCount / samples.length >= 0.7) {
        col.type = 'quantitative';
      } else {
        col.type = 'categorical';
      }
    }
  });

  return { columns, rows: dataRows };
}

/**
 * Export table data to CSV file with UTF-8 BOM
 */
export function exportToCSV(
  columns: Column[],
  rows: RowData[],
  filename: string = 'statxai-data.csv',
  includeUnits: boolean = true
) {
  if (columns.length === 0) return;
  const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  const headerLine = columns
    .map((c) => `"${(c.name + (includeUnits && c.unit ? ` (${c.unit})` : '')).replace(/"/g, '""')}"`)
    .join(',');

  const rowLines = rows.map((r) => {
    return columns
      .map((col) => {
        const val = r[col.id];
        const valStr = val === undefined || val === null ? '' : String(val);
        return `"${valStr.replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const fullContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export table data to formatted Excel (.xls) file compatible with Microsoft Excel & Google Sheets
 */
export function exportToExcel(
  columns: Column[],
  rows: RowData[],
  filename: string = 'statxai-data.xls',
  includeUnits: boolean = true
) {
  if (columns.length === 0) return;
  const cleanFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;

  const headerCells = columns
    .map(
      (c) =>
        `<th style="background-color: #1d4ed8; color: #ffffff; font-weight: bold; border: 1px solid #94a3b8; padding: 10px 14px; text-align: left; font-size: 13px;">${
          c.name
        }${includeUnits && c.unit ? ` (${c.unit})` : ''}</th>`
    )
    .join('');

  const rowHtml = rows
    .map((r, idx) => {
      const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = columns
        .map((col) => {
          const val = r[col.id] !== undefined && r[col.id] !== null ? String(r[col.id]) : '';
          return `<td style="border: 1px solid #cbd5e1; padding: 8px 12px; background-color: ${bgColor}; font-size: 12px;">${val}</td>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Du_Lieu_The_Luc</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <thead>
            <tr>${headerCells}</tr>
          </thead>
          <tbody>
            ${rowHtml}
          </tbody>
        </table>
      </body>
    </html>
  `.trim();

  const blob = new Blob(['\uFEFF' + excelHtml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy table data as Tab-Separated Values (TSV) directly to system clipboard
 * Ready to paste (Ctrl+V) into Excel or Google Sheets
 */
export async function copyTableToClipboard(
  columns: Column[],
  rows: RowData[],
  includeUnits: boolean = true
): Promise<boolean> {
  if (columns.length === 0) return false;

  const headerLine = columns
    .map((c) => `${c.name}${includeUnits && c.unit ? ` (${c.unit})` : ''}`)
    .join('\t');

  const rowLines = rows.map((r) => {
    return columns
      .map((col) => {
        const val = r[col.id];
        return val === undefined || val === null ? '' : String(val).replace(/\t/g, ' ');
      })
      .join('\t');
  });

  const fullText = [headerLine, ...rowLines].join('\n');
  try {
    await navigator.clipboard.writeText(fullText);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Export custom matrix or table to CSV
 */
export function exportCustomTableToCSV(
  headers: string[],
  rows: (string | number)[][],
  filename: string
) {
  const headerLine = headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(',');
  const rowLines = rows.map((r) => {
    return r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',');
  });

  const fullContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
