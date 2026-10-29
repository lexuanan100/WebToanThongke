import React, { useState } from 'react';
import {
  AlertCircle,
  Calculator,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Download,
  HelpCircle,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  Square
} from 'lucide-react';
import { Column, DescriptiveResult, RowData } from '../types';
import { calculateDescriptiveStats } from '../utils/statistics';
import { exportCustomTableToCSV } from '../utils/csv';

interface DescriptiveStatsProps {
  columns: Column[];
  rows: RowData[];
  onOpenDataTab: () => void;
}

export const DescriptiveStats: React.FC<DescriptiveStatsProps> = ({
  columns,
  rows,
  onOpenDataTab,
}) => {
  // Only quantitative columns can be analyzed
  const quantitativeColumns = columns.filter((c) => c.type === 'quantitative');

  // Selected column IDs for analysis
  const [selectedColIds, setSelectedColIds] = useState<string[]>(
    quantitativeColumns.map((c) => c.id)
  );

  // Results state
  const [results, setResults] = useState<DescriptiveResult[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Toggle single column selection
  const handleToggleCol = (colId: string) => {
    setSelectedColIds((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  // Select all or deselect all
  const handleSelectAll = () => {
    if (selectedColIds.length === quantitativeColumns.length) {
      setSelectedColIds([]);
    } else {
      setSelectedColIds(quantitativeColumns.map((c) => c.id));
    }
  };

  // Run descriptive statistics
  const handleRunStats = () => {
    if (selectedColIds.length === 0) return;

    const computedResults: DescriptiveResult[] = [];

    for (const colId of selectedColIds) {
      const col = columns.find((c) => c.id === colId);
      if (!col) continue;

      const values = rows.map((r) => r[col.id]);
      const res = calculateDescriptiveStats(values, col.id, col.name, col.unit);
      if (res) {
        computedResults.push(res);
      }
    }

    setResults(computedResults);
    setHasRun(true);
  };

  // Export results table to CSV
  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Tên biến',
      'Đơn vị',
      'Số quan sát hợp lệ (N)',
      'Số quan sát thiếu',
      'Trung bình (Mean)',
      'Trung vị (Median)',
      'Mốt (Mode)',
      'Giá trị nhỏ nhất (Min)',
      'Giá trị lớn nhất (Max)',
      'Khoảng biến thiên (Range)',
      'Phương sai mẫu (s²)',
      'Độ lệch chuẩn (s)',
      'Sai số chuẩn (SE)',
      'Hệ số biến thiên CV (%)',
      'Tứ phân vị Q1',
      'Tứ phân vị Q3',
      'Độ trải giữa IQR',
    ];

    const dataRows = results.map((r) => [
      r.columnName,
      r.unit || '',
      r.validN,
      r.missingN,
      r.mean,
      r.median,
      Array.isArray(r.mode) ? r.mode.join('; ') : r.mode,
      r.min,
      r.max,
      r.range,
      r.variance,
      r.sd,
      r.se,
      `${r.cv}%`,
      r.q1,
      r.q3,
      r.iqr,
    ]);

    exportCustomTableToCSV(headers, dataRows, 'statxai-thong-ke-mo-ta.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header and Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Thống kê mô tả tự động</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tính toán các tham số đặc trưng: Trung bình, Trung vị, Mốt, Độ lệch chuẩn, Phương sai trên dữ liệu sinh viên do bạn nhập.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Ý nghĩa chỉ số trong GDTC</span>
              {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Variable Selection Section */}
        {quantitativeColumns.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Chưa có biến định lượng:</strong> Thống kê mô tả chỉ tính toán trên các cột dạng số (định lượng). 
              Hiện bảng của bạn chưa có cột định lượng nào hoặc bạn chưa nhập dữ liệu.{' '}
              <button
                onClick={onOpenDataTab}
                className="underline font-bold text-blue-700 hover:text-blue-800 ml-1"
              >
                Chuyển sang tab Nhập dữ liệu để thêm cột hoặc đổi loại biến.
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Chọn biến định lượng cần phân tích ({selectedColIds.length}/{quantitativeColumns.length} biến đã chọn):
              </span>
              <button
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                {selectedColIds.length === quantitativeColumns.length ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Bỏ chọn tất cả</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Chọn tất cả</span>
                  </>
                )}
              </button>
            </div>

            {/* Variable Pills / Checkboxes */}
            <div className="flex flex-wrap gap-2">
              {quantitativeColumns.map((col) => {
                const isSelected = selectedColIds.includes(col.id);
                return (
                  <button
                    key={col.id}
                    onClick={() => handleToggleCol(col.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{col.name}</span>
                    {col.unit && <span className="opacity-80 text-[10px]">({col.unit})</span>}
                    {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Run Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleRunStats}
                disabled={selectedColIds.length === 0 || rows.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Chạy thống kê mô tả</span>
              </button>

              {rows.length === 0 && (
                <span className="text-xs text-rose-600 font-medium">
                  * Bảng dữ liệu chưa có dòng nào. Vui lòng nhập số liệu trước khi chạy.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Educational Reference: Meanings in Physical Education */}
      {showExplanation && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-xs text-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Ý nghĩa các tham số thống kê mô tả trong Đánh giá Thể lực & Giáo dục Thể chất</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs space-y-1">
              <span className="font-bold text-slate-900">Trung bình mẫu (Mean - X̄):</span>
              <p className="text-slate-600">
                Mức độ thể lực đại diện của toàn bộ nhóm sinh viên. Dễ bị kéo lệch bởi các sinh viên có thể lực quá vượt trội (vận động viên) hoặc quá yếu.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs space-y-1">
              <span className="font-bold text-slate-900">Trung vị (Median):</span>
              <p className="text-slate-600">
                Giá trị chia đôi nhóm sinh viên thành 2 nửa (50% sinh viên đạt dưới mức này, 50% đạt trên). Rất tin cậy khi phân bố thể lực bị lệch.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs space-y-1">
              <span className="font-bold text-slate-900">Độ lệch chuẩn mẫu (s):</span>
              <p className="text-slate-600">
                Đo độ phân tán của thể lực quanh mức trung bình. Độ lệch chuẩn càng nhỏ thể hiện nhóm sinh viên có trình độ thể lực càng đồng đều.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs space-y-1">
              <span className="font-bold text-slate-900">Hệ số biến thiên CV (%):</span>
              <p className="text-slate-600">
                CV &lt; 10%: Nhóm thể lực rất đồng đều; 10% - 20%: Đồng đều trung bình; &gt; 20%: Phân hóa lớn, giáo viên cần chia nhóm tập luyện phù hợp.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs space-y-1">
              <span className="font-bold text-slate-900">Khoảng biến thiên (Range):</span>
              <p className="text-slate-600">
                Hiệu số giữa thành tích cao nhất (Max) và thấp nhất (Min), cho biết biên độ dao động thể lực cực đại trong lớp học.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs space-y-1">
              <span className="font-bold text-slate-900">Sai số chuẩn (SE):</span>
              <p className="text-slate-600">
                Đo lường độ chính xác khi ước lượng thể lực trung bình của toàn thể sinh viên từ mẫu khảo sát. Mẫu càng lớn thì SE càng nhỏ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display Area */}
      {hasRun && results.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Bảng kết quả Thống kê mô tả ({results.length} biến định lượng)
              </h3>
              <p className="text-xs text-slate-500">
                Được tính toán trực tiếp từ {rows.length} dòng dữ liệu sinh viên đang có trong hệ thống.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Xuất kết quả CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 font-bold text-slate-900 sticky left-0 bg-slate-100 z-10 min-w-[150px]">
                    Tên biến
                  </th>
                  <th className="py-3 px-3 text-center font-semibold" title="Số quan sát có số liệu hợp lệ">
                    N hợp lệ
                  </th>
                  <th className="py-3 px-3 text-center font-semibold" title="Số quan sát để trống hoặc sai định dạng">
                    N thiếu
                  </th>
                  <th className="py-3 px-3 font-semibold text-blue-700 bg-blue-50/50" title="Trung bình mẫu (Mean)">
                    Trung bình (X̄)
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Trung vị">
                    Trung vị
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Giá trị xuất hiện nhiều nhất">
                    Mốt (Mode)
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Giá trị nhỏ nhất">
                    Min
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Giá trị lớn nhất">
                    Max
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Khoảng biến thiên = Max - Min">
                    Khoảng (R)
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Phương sai mẫu s²">
                    Phương sai (s²)
                  </th>
                  <th className="py-3 px-3 font-semibold text-indigo-700 bg-indigo-50/50" title="Độ lệch chuẩn mẫu s">
                    Độ lệch chuẩn (s)
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Sai số chuẩn SE">
                    SE
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Hệ số biến thiên CV%">
                    CV (%)
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Tứ phân vị Q1 (25%)">
                    Q₁
                  </th>
                  <th className="py-3 px-3 font-semibold" title="Tứ phân vị Q3 (75%)">
                    Q₃
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {results.map((res) => (
                  <tr key={res.columnId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div>
                        <span>{res.columnName}</span>
                        {res.unit && (
                          <span className="text-[10px] text-slate-400 font-normal ml-1">({res.unit})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{res.validN}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{res.missingN}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700 bg-blue-50/30">
                      {res.mean.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-3 font-mono">{res.median.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {Array.isArray(res.mode) ? res.mode.join(', ') : res.mode}
                    </td>
                    <td className="py-3 px-3 font-mono">{res.min.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 font-mono">{res.max.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 font-mono">{res.range.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{res.variance.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700 bg-indigo-50/30">
                      {res.sd.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{res.se.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 font-mono font-semibold">
                      <span
                        className={
                          res.cv < 10
                            ? 'text-emerald-700'
                            : res.cv <= 20
                            ? 'text-blue-700'
                            : 'text-amber-700'
                        }
                      >
                        {res.cv.toLocaleString('vi-VN')}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{res.q1.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{res.q3.toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick pedagogical insights card for each analyzed variable */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Nhận xét sư phạm nhanh về dữ liệu vừa tính toán:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {results.map((r) => {
                const diffMeanMedian = Math.abs(r.mean - r.median);
                const isSkewed = diffMeanMedian > 0.2 * r.sd;
                return (
                  <div key={r.columnId} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{r.columnName}</span>
                      <span className="text-[11px] text-slate-500 font-normal">N = {r.validN}</span>
                    </div>
                    <p className="text-slate-600">
                      • Trung bình: <strong className="text-slate-800">{r.mean} {r.unit}</strong>, Trung vị:{' '}
                      <strong className="text-slate-800">{r.median} {r.unit}</strong>.
                      {isSkewed
                        ? ` (Phân bố có xu hướng bị lệch do chênh lệch giữa Trung bình và Trung vị, độ lệch chuẩn s = ${r.sd}).`
                        : ` (Phân bố tương đối cân đối đối xứng quanh giá trị trung bình).`}
                    </p>
                    <p className="text-slate-600">
                      • Hệ số biến thiên CV = <strong className="text-slate-800">{r.cv}%</strong>:{' '}
                      {r.cv < 10
                        ? 'Nhóm sinh viên có trình độ thể lực rất đồng đều.'
                        : r.cv <= 20
                        ? 'Độ đồng đều ở mức trung bình, phù hợp cho bài tập chung.'
                        : 'Mức độ phân hóa thể lực giữa các sinh viên tương đối lớn, cần cá nhân hóa bài tập.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : hasRun && results.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-900">Không tìm thấy dữ liệu số hợp lệ</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Các cột bạn chọn chưa chứa giá trị số hợp lệ. Hãy kiểm tra lại số liệu đã nhập ở tab "Nhập dữ liệu" (chú ý không để trống toàn bộ hoặc nhập chữ vào cột định lượng).
          </p>
        </div>
      ) : null}
    </div>
  );
};
