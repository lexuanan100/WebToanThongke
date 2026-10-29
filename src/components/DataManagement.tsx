import React, { useState, useRef, useId } from 'react';
import {
  AlertCircle,
  Check,
  CheckCheck,
  ClipboardPaste,
  Columns3,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  FileUp,
  HelpCircle,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Table,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { Column, ColumnType, RowData } from '../types';
import { exportToCSV, exportToExcel, copyTableToClipboard, parseCSV } from '../utils/csv';

interface DataManagementProps {
  columns: Column[];
  rows: RowData[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  onClearAll: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  columns,
  rows,
  setColumns,
  setRows,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modals state
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<ColumnType>('quantitative');
  const [newColumnUnit, setNewColumnUnit] = useState('');

  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [editColName, setEditColName] = useState('');
  const [editColType, setEditColType] = useState<ColumnType>('quantitative');
  const [editColUnit, setEditColUnit] = useState('');

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pastedRawText, setPastedRawText] = useState('');
  const [pasteHasHeaders, setPasteHasHeaders] = useState(true);
  const [pasteMode, setPasteMode] = useState<'replace' | 'append'>('replace');

  // Multi-row add input
  const [multiRowsCount, setMultiRowsCount] = useState<number>(5);

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFilename, setExportFilename] = useState('bang-so-lieu-the-luc');
  const [exportIncludeUnits, setExportIncludeUnits] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Export handlers
  const handleTriggerExportCSV = (customName?: string) => {
    if (columns.length === 0 || rows.length === 0) {
      showNotification('Bảng chưa có dòng dữ liệu nào để xuất tệp CSV.', 'error');
      return;
    }
    const name = (customName || exportFilename).trim() || 'bang-so-lieu-the-luc';
    exportToCSV(columns, rows, `${name}.csv`, exportIncludeUnits);
    showNotification(`Đã xuất tệp CSV "${name}.csv" thành công (chuẩn UTF-8 BOM tiếng Việt).`, 'success');
    setIsExportModalOpen(false);
  };

  const handleTriggerExportExcel = (customName?: string) => {
    if (columns.length === 0 || rows.length === 0) {
      showNotification('Bảng chưa có dòng dữ liệu nào để xuất tệp Excel.', 'error');
      return;
    }
    const name = (customName || exportFilename).trim() || 'bang-so-lieu-the-luc';
    exportToExcel(columns, rows, `${name}.xls`, exportIncludeUnits);
    showNotification(`Đã xuất tệp Excel "${name}.xls" thành công, mở trực tiếp bằng MS Excel hoặc Google Sheets!`, 'success');
    setIsExportModalOpen(false);
  };

  const handleTriggerCopyClipboard = async () => {
    if (columns.length === 0 || rows.length === 0) {
      showNotification('Bảng chưa có dữ liệu để sao chép.', 'error');
      return;
    }
    const success = await copyTableToClipboard(columns, rows, exportIncludeUnits);
    if (success) {
      setHasCopied(true);
      showNotification('Đã sao chép toàn bộ bảng! Bạn có thể dán (Ctrl+V) ngay vào Excel hoặc Google Sheets.', 'success');
      setTimeout(() => setHasCopied(false), 3000);
    } else {
      showNotification('Không thể sao chép vào bộ nhớ tạm. Hãy dùng tính năng tải file.', 'error');
    }
  };

  // Add a single blank row
  const handleAddRow = () => {
    if (columns.length === 0) {
      showNotification('Vui lòng thêm ít nhất một cột trước khi thêm dòng dữ liệu.', 'error');
      return;
    }
    const newRow: RowData = {
      id: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    columns.forEach((col) => {
      newRow[col.id] = '';
    });
    setRows((prev) => [...prev, newRow]);
    showNotification('Đã thêm 1 dòng dữ liệu mới.', 'success');
  };

  // Add multiple blank rows (5, 10, 20...)
  const handleAddMultipleRows = (count: number) => {
    if (columns.length === 0) {
      showNotification('Vui lòng thêm cột trước khi thêm dòng dữ liệu.', 'error');
      return;
    }
    const newRows: RowData[] = [];
    for (let i = 0; i < count; i++) {
      const row: RowData = {
        id: `row_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      };
      columns.forEach((col) => {
        row[col.id] = '';
      });
      newRows.push(row);
    }
    setRows((prev) => [...prev, ...newRows]);
    showNotification(`Đã thêm ${count} dòng trống để bạn nhập liệu.`, 'success');
  };

  // Cell editing
  const handleCellChange = (rowId: string, columnId: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          return { ...r, [columnId]: value };
        }
        return r;
      })
    );
  };

  // Delete a single row
  const handleDeleteRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    showNotification('Đã xóa 1 dòng.', 'info');
  };

  // Add new column
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newColumnName.trim();
    if (!trimmed) {
      showNotification('Tên cột không được để trống.', 'error');
      return;
    }

    const colId = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCol: Column = {
      id: colId,
      name: trimmed,
      type: newColumnType,
      unit: newColumnUnit.trim() || undefined,
    };

    setColumns((prev) => [...prev, newCol]);

    // Update existing rows with empty value for new column
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        [colId]: '',
      }))
    );

    setNewColumnName('');
    setNewColumnUnit('');
    setIsAddColumnModalOpen(false);
    showNotification(`Đã thêm cột "${newCol.name}" (${newCol.type === 'quantitative' ? 'Định lượng' : 'Phân loại'}).`, 'success');
  };

  // Save edited column
  const handleSaveEditColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColumn) return;
    const trimmed = editColName.trim();
    if (!trimmed) {
      showNotification('Tên cột không được để trống.', 'error');
      return;
    }

    setColumns((prev) =>
      prev.map((c) =>
        c.id === editingColumn.id
          ? {
              ...c,
              name: trimmed,
              type: editColType,
              unit: editColUnit.trim() || undefined,
            }
          : c
      )
    );

    setEditingColumn(null);
    showNotification(`Đã cập nhật thông tin cột "${trimmed}".`, 'success');
  };

  // Delete column
  const handleDeleteColumn = (colId: string) => {
    const colToDelete = columns.find((c) => c.id === colId);
    if (!colToDelete) return;
    setColumns((prev) => prev.filter((c) => c.id !== colId));
    setRows((prev) =>
      prev.map((r) => {
        const newRow = { ...r };
        delete newRow[colId];
        return newRow;
      })
    );
    showNotification(`Đã xóa cột "${colToDelete.name}".`, 'info');
  };

  // Preset Column Headers Template (Strictly WITHOUT any rows/data, keeping table empty!)
  const handleApplyPresetHeaders = () => {

    const presetCols: Column[] = [
      { id: 'col_id', name: 'Mã SV', type: 'categorical' },
      { id: 'col_gender', name: 'Giới tính', type: 'categorical' },
      { id: 'col_age', name: 'Tuổi', type: 'quantitative', unit: 'tuổi' },
      { id: 'col_height', name: 'Chiều cao', type: 'quantitative', unit: 'cm' },
      { id: 'col_weight', name: 'Cân nặng', type: 'quantitative', unit: 'kg' },
      { id: 'col_sessions', name: 'Số buổi tập/tuần', type: 'quantitative', unit: 'buổi' },
      { id: 'col_duration', name: 'Thời gian tập', type: 'quantitative', unit: 'phút' },
      { id: 'col_pushups', name: 'Chống đẩy (1 phút)', type: 'quantitative', unit: 'lần' },
      { id: 'col_heartrate', name: 'Nhịp tim lúc nghỉ', type: 'quantitative', unit: 'bpm' },
      { id: 'col_group', name: 'Nhóm tập luyện', type: 'categorical' },
    ];

    setColumns(presetCols);
    setRows([]); // Guaranteed empty rows!
    showNotification('Đã thiết lập khung 10 cột gợi ý cho Giáo dục thể chất. Bảng dữ liệu hoàn toàn trống, sẵn sàng để bạn nhập số liệu.', 'success');
  };

  // CSV File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.error) {
        showNotification(parsed.error, 'error');
        return;
      }

      setColumns(parsed.columns);
      setRows(parsed.rows);
      showNotification(`Tải tệp thành công! Đã nạp ${parsed.rows.length} dòng và ${parsed.columns.length} cột từ tệp CSV của bạn.`, 'success');
    };
    reader.onerror = () => {
      showNotification('Không thể đọc tệp tin. Vui lòng kiểm tra lại định dạng tệp.', 'error');
    };
    reader.readAsText(file, 'utf-8');

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Paste from Excel / Google Sheets
  const handleApplyPaste = () => {
    if (!pastedRawText.trim()) {
      showNotification('Vui lòng dán văn bản từ bảng tính trước khi nhấn Áp dụng.', 'error');
      return;
    }

    const parsed = parseCSV(pastedRawText);
    if (parsed.error) {
      showNotification(parsed.error, 'error');
      return;
    }

    if (pasteMode === 'replace' || columns.length === 0) {
      setColumns(parsed.columns);
      setRows(parsed.rows);
      showNotification(`Đã tạo bảng mới từ dữ liệu dán (${parsed.rows.length} dòng, ${parsed.columns.length} cột).`, 'success');
    } else {
      // Append mode: map pasted data to existing columns if counts match, or append
      const newRows: RowData[] = parsed.rows.map((r, idx) => {
        const rowObj: RowData = {
          id: `row_pasted_${Date.now()}_${idx}`,
        };
        columns.forEach((col, cIdx) => {
          const pastedColId = parsed.columns[cIdx]?.id;
          rowObj[col.id] = pastedColId ? r[pastedColId] : '';
        });
        return rowObj;
      });
      setRows((prev) => [...prev, ...newRows]);
      showNotification(`Đã nối thêm ${newRows.length} dòng vào bảng dữ liệu hiện tại.`, 'success');
    }

    setPastedRawText('');
    setIsPasteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{notification.message}</div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-5 h-5 text-blue-600" />
              <span>Bảng dữ liệu thực nghiệm</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tự nhập trực tiếp, thêm bớt dòng/cột tùy ý, dán từ bảng tính hoặc tải lên tệp CSV.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Add Column */}
            <button
              onClick={() => {
                setNewColumnName('');
                setNewColumnUnit('');
                setNewColumnType('quantitative');
                setIsAddColumnModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Thêm cột</span>
            </button>

            {/* Paste from Excel/Sheets */}
            <button
              onClick={() => setIsPasteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              title="Sao chép từ Excel hoặc Google Sheets rồi dán vào đây"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dán từ Excel</span>
            </button>

            {/* Upload CSV */}
            <label
              htmlFor={fileInputId}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors"
              title="Tải tệp CSV (.csv, .tsv, .txt) từ máy tính"
            >
              <FileUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tải tệp CSV</span>
              <input
                id={fileInputId}
                ref={fileInputRef}
                type="file"
                accept=".csv, .tsv, .txt"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>

            {/* Export Excel / CSV */}
            {rows.length > 0 && (
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-2xs"
                title="Xuất bảng dữ liệu hiện tại ra file Excel (.xls) hoặc CSV để mở trong Excel, SPSS, R"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất Excel / CSV</span>
              </button>
            )}

            {/* Clear All */}
            {(columns.length > 0 || rows.length > 0) && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors ml-auto lg:ml-0"
                title="Xóa toàn bộ dữ liệu trong bảng"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa bảng</span>
              </button>
            )}
          </div>
        </div>

        {/* Row Addition Bar & Helpful Presets */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">Thêm dòng:</span>
            <button
              onClick={handleAddRow}
              disabled={columns.length === 0}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-1 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>+1 dòng</span>
            </button>
            <button
              onClick={() => handleAddMultipleRows(5)}
              disabled={columns.length === 0}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-700 disabled:opacity-50"
            >
              +5 dòng
            </button>
            <button
              onClick={() => handleAddMultipleRows(10)}
              disabled={columns.length === 0}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-700 disabled:opacity-50"
            >
              +10 dòng
            </button>
            <button
              onClick={() => handleAddMultipleRows(30)}
              disabled={columns.length === 0}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-700 disabled:opacity-50"
            >
              +30 dòng
            </button>
          </div>

          {/* Quick preset headers button (creates blank schema only, no fake data rows!) */}
          {columns.length === 0 && (
            <button
              onClick={handleApplyPresetHeaders}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Tạo nhanh khung 10 cột thể lực mẫu (bảng rỗng không có số liệu)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Area */}
      {columns.length === 0 ? (
        /* Empty State 1: No columns defined */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Table className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Bảng dữ liệu đang trống</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Theo quy chuẩn học tập, ứng dụng không nạp sẵn dữ liệu mẫu. 
              Bạn hãy bắt đầu bằng cách thêm cột mới, dán từ Excel hoặc tải tệp CSV thực tế của bạn.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setNewColumnName('');
                setNewColumnUnit('');
                setNewColumnType('quantitative');
                setIsAddColumnModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm cột đầu tiên</span>
            </button>
            <button
              onClick={handleApplyPresetHeaders}
              className="px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Áp dụng khung 10 cột thể lực gợi ý</span>
            </button>
            <button
              onClick={() => setIsPasteModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 flex items-center gap-1.5"
            >
              <ClipboardPaste className="w-4 h-4" />
              <span>Dán dữ liệu từ Excel / Sheets</span>
            </button>
          </div>
        </div>
      ) : rows.length === 0 ? (
        /* Empty State 2: Columns exist, but 0 rows */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Đã tạo {columns.length} cột ({columns.filter((c) => c.type === 'quantitative').length} định lượng,{' '}
              {columns.filter((c) => c.type === 'categorical').length} phân loại). Chưa có dòng nào.
            </span>
            <button
              onClick={handleAddRow}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm dòng đầu tiên</span>
            </button>
          </div>

          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-slate-600">
              Khung bảng đã sẵn sàng. Hãy bấm nút <strong>"+1 dòng"</strong> hoặc <strong>"+5 dòng"</strong> ở thanh công cụ phía trên để bắt đầu gõ số liệu trực tiếp, hoặc dán từ bảng tính Excel.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleAddMultipleRows(5)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200"
              >
                +5 dòng trống
              </button>
              <button
                onClick={() => handleAddMultipleRows(10)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200"
              >
                +10 dòng trống
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Interactive Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto max-h-[620px] scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/90 text-slate-700 sticky top-0 z-20 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                <tr>
                  <th className="py-3 px-3 w-12 text-center font-bold text-slate-400 bg-slate-100">STT</th>
                  {columns.map((col) => (
                    <th key={col.id} className="py-2.5 px-3 min-w-[140px] font-semibold">
                      <div className="flex items-center justify-between gap-1 group">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span
                            className="font-bold text-slate-900 truncate"
                            title={`${col.name}${col.unit ? ` (${col.unit})` : ''}`}
                          >
                            {col.name}
                          </span>
                          {col.unit && <span className="text-[10px] text-slate-400 font-normal">({col.unit})</span>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Type indicator */}
                          <span
                            className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                              col.type === 'quantitative'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                            title={col.type === 'quantitative' ? 'Biến định lượng (số)' : 'Biến phân loại (nhóm)'}
                          >
                            {col.type === 'quantitative' ? 'Số' : 'Phân loại'}
                          </span>

                          {/* Edit button */}
                          <button
                            onClick={() => {
                              setEditingColumn(col);
                              setEditColName(col.name);
                              setEditColType(col.type);
                              setEditColUnit(col.unit || '');
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-white transition-colors"
                            title="Sửa tên hoặc đổi loại biến"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteColumn(col.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors"
                            title="Xóa cột này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="py-2.5 px-3 w-12 text-center font-semibold text-slate-500">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {rows.map((row, rIndex) => (
                  <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px] bg-slate-50/40 select-none">
                      {rIndex + 1}
                    </td>
                    {columns.map((col) => {
                      const val = row[col.id] !== undefined ? String(row[col.id]) : '';
                      return (
                        <td key={col.id} className="py-1 px-2 border-r border-slate-100 last:border-r-0">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                            placeholder={col.type === 'quantitative' ? '0.0' : 'Nhập...'}
                            className="w-full px-2 py-1.5 text-xs text-slate-900 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded focus:outline-hidden transition-all font-mono"
                          />
                        </td>
                      );
                    })}
                    <td className="py-1 px-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                        title="Xóa dòng này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Status Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-3">
              <span>
                Tổng số dòng sinh viên: <strong className="text-slate-900 font-semibold">{rows.length}</strong>
              </span>
              <span>•</span>
              <span>
                Tổng số cột biến: <strong className="text-slate-900 font-semibold">{columns.length}</strong>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleTriggerCopyClipboard}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Sao chép toàn bộ bảng vào bộ nhớ tạm (dán trực tiếp vào Excel)"
              >
                {hasCopied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy bảng</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleTriggerExportCSV()}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Tải nhanh file CSV (UTF-8 BOM cho Excel/SPSS)"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Xuất CSV</span>
              </button>
              <button
                onClick={() => handleTriggerExportExcel()}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 text-emerald-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Xuất trực tiếp file Microsoft Excel (.xls) có định dạng bảng"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất Excel (.xls)</span>
              </button>
              <button
                onClick={handleAddRow}
                className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Thêm dòng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Column */}
      {isAddColumnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Thêm cột biến mới</h3>
              <button
                onClick={() => setIsAddColumnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddColumn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên cột / Tên biến *</label>
                <input
                  type="text"
                  required
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Ví dụ: Chống đẩy, Chiều cao, Nhóm tập..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loại biến *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewColumnType('quantitative')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      newColumnType === 'quantitative'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Biến định lượng</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Số đo lường, ví dụ số lần, cm, kg, phút, bpm</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewColumnType('categorical')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      newColumnType === 'categorical'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-900 ring-2 ring-amber-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Biến phân loại</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Nhóm, lớp, giới tính (Nam/Nữ), thực nghiệm</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị đo (không bắt buộc)</label>
                <input
                  type="text"
                  value={newColumnUnit}
                  onChange={(e) => setNewColumnUnit(e.target.value)}
                  placeholder="Ví dụ: lần, cm, kg, phút, bpm..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddColumnModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Thêm cột
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Column */}
      {editingColumn && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Chỉnh sửa thông tin cột</h3>
              <button
                onClick={() => setEditingColumn(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditColumn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên cột *</label>
                <input
                  type="text"
                  required
                  value={editColName}
                  onChange={(e) => setEditColName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loại biến *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditColType('quantitative')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      editColType === 'quantitative'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Biến định lượng</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Dùng cho tính toán trung bình, ANOVA, biểu đồ phân tán</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditColType('categorical')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      editColType === 'categorical'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-900 ring-2 ring-amber-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Biến phân loại</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Dùng cho biến nhóm trong ANOVA, so sánh tần số</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị đo</label>
                <input
                  type="text"
                  value={editColUnit}
                  onChange={(e) => setEditColUnit(e.target.value)}
                  placeholder="Ví dụ: lần, cm, kg, phút..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingColumn(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Paste from Excel / Google Sheets */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Dán dữ liệu từ Excel / Google Sheets</h3>
              </div>
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Trong Excel hoặc Google Sheets, hãy bôi đen vùng dữ liệu (bao gồm cả dòng tiêu đề cột nếu có), nhấn <strong>Ctrl+C</strong> (hoặc Cmd+C), sau đó dán vào ô bên dưới bằng <strong>Ctrl+V</strong>:
            </p>

            <textarea
              rows={8}
              value={pastedRawText}
              onChange={(e) => setPastedRawText(e.target.value)}
              placeholder="Dán dữ liệu vào đây (hỗ trợ tab từ Excel, dấu phẩy hoặc chấm phẩy)..."
              className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 bg-slate-50"
              autoFocus
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="pasteMode"
                    checked={pasteMode === 'replace'}
                    onChange={() => setPasteMode('replace')}
                    className="text-blue-600"
                  />
                  <span>Tạo bảng mới hoàn toàn</span>
                </label>

                {columns.length > 0 && (
                  <label className="flex items-center gap-1.5 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="pasteMode"
                      checked={pasteMode === 'append'}
                      onChange={() => setPasteMode('append')}
                      className="text-blue-600"
                    />
                    <span>Nối thêm vào bảng hiện tại</span>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleApplyPaste}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Áp dụng dữ liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Export Data to Excel / CSV */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Xuất dữ liệu sinh viên
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tải về máy tính hoặc sao chép để phân tích trong Excel, SPSS, R, Python
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-500">Dữ liệu hiện tại:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold bg-blue-100 text-blue-800">
                  {rows.length} sinh viên (dòng)
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold bg-indigo-100 text-indigo-800">
                  {columns.length} biến (cột)
                </span>
              </div>
            </div>

            {/* Form Options */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên tệp xuất (không cần gõ đuôi tệp):
                </label>
                <input
                  type="text"
                  value={exportFilename}
                  onChange={(e) => setExportFilename(e.target.value)}
                  placeholder="bang-so-lieu-the-luc"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 font-mono text-slate-800 bg-white"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={exportIncludeUnits}
                  onChange={(e) => setExportIncludeUnits(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">Kèm đơn vị đo vào tiêu đề cột</span>
                  <p className="text-slate-500 mt-0.5 leading-normal">
                    Ví dụ: <code className="bg-slate-200/70 px-1 py-0.5 text-[11px] rounded font-mono">Chống đẩy (lần)</code>, <code className="bg-slate-200/70 px-1 py-0.5 text-[11px] rounded font-mono">Chiều cao (cm)</code>. Giúp bảng tính tự giải thích khi mở độc lập.
                  </p>
                </div>
              </label>
            </div>

            {/* Export Action Cards */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-700">Chọn cách xuất dữ liệu:</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Excel Option */}
                <button
                  type="button"
                  onClick={() => handleTriggerExportExcel()}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 hover:border-emerald-400 text-center transition-all group shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-7 h-7 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-emerald-950">File Excel (.xls)</span>
                  <span className="text-[10px] text-emerald-700 mt-0.5 leading-tight">Định dạng bảng đẹp, mở ngay trong Excel</span>
                </button>

                {/* CSV Option */}
                <button
                  type="button"
                  onClick={() => handleTriggerExportCSV()}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-100 hover:border-blue-400 text-center transition-all group shadow-2xs cursor-pointer"
                >
                  <FileText className="w-7 h-7 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-blue-950">File CSV (.csv)</span>
                  <span className="text-[10px] text-blue-700 mt-0.5 leading-tight">Chuẩn UTF-8 BOM, nhập SPSS/R/Python</span>
                </button>

                {/* Copy Clipboard Option */}
                <button
                  type="button"
                  onClick={handleTriggerCopyClipboard}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 text-center transition-all group shadow-2xs cursor-pointer"
                >
                  {hasCopied ? (
                    <>
                      <CheckCheck className="w-7 h-7 text-emerald-600 mb-1.5" />
                      <span className="text-xs font-bold text-emerald-800">Đã sao chép!</span>
                      <span className="text-[10px] text-emerald-700 mt-0.5 leading-tight">Dán (Ctrl+V) vào Excel</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-7 h-7 text-slate-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-800">Copy bảng (TSV)</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">Dán trực tiếp vào bảng tính</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Note on UTF-8 */}
            <p className="text-[11px] text-slate-600 bg-amber-50/70 border border-amber-200/70 p-2.5 rounded-lg text-amber-900 leading-normal">
              💡 <strong>Lưu ý tiếng Việt:</strong> Tệp xuất được nhúng mã UTF-8 BOM, đảm bảo mở trên mọi phiên bản Microsoft Excel (Windows & Mac) hoàn toàn không bị lỗi font dấu tiếng Việt.
            </p>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
