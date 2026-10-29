import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  BarChart2,
  BarChart3,
  Download,
  Info,
  Layers,
  LineChart,
  PieChart,
  RefreshCw,
  ScatterChart,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { ChartType, Column, RowData } from '../types';
import { calculateCorrelation, calculateDescriptiveStats } from '../utils/statistics';

interface ChartsViewProps {
  columns: Column[];
  rows: RowData[];
  onOpenDataTab: () => void;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ columns, rows, onOpenDataTab }) => {
  const quantitativeColumns = columns.filter((c) => c.type === 'quantitative');
  const categoricalColumns = columns.filter((c) => c.type === 'categorical');

  // Chart configuration state
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [barMode, setBarMode] = useState<'mean_by_group' | 'frequency'>('mean_by_group');

  // Variable selections
  const [quantVar1, setQuantVar1] = useState<string>(quantitativeColumns[0]?.id || '');
  const [quantVar2, setQuantVar2] = useState<string>(quantitativeColumns[1]?.id || quantitativeColumns[0]?.id || '');
  const [catVar, setCatVar] = useState<string>(categoricalColumns[0]?.id || '');

  // Histogram options
  const [histBinsCount, setHistBinsCount] = useState<number>(6);
  const [showNormalCurve, setShowNormalCurve] = useState<boolean>(true);

  // Active hover tooltip state
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; content: string } | null>(null);

  // Synchronize defaults if columns change
  React.useEffect(() => {
    if (!quantVar1 && quantitativeColumns.length > 0) {
      setQuantVar1(quantitativeColumns[0].id);
    }
    if (!quantVar2 && quantitativeColumns.length > 1) {
      setQuantVar2(quantitativeColumns[1].id);
    }
    if (!catVar && categoricalColumns.length > 0) {
      setCatVar(categoricalColumns[0].id);
    }
  }, [quantitativeColumns, categoricalColumns, quantVar1, quantVar2, catVar]);

  // Selected column objects
  const qCol1 = columns.find((c) => c.id === quantVar1);
  const qCol2 = columns.find((c) => c.id === quantVar2);
  const cCol = columns.find((c) => c.id === catVar);

  // 1. Data for Bar Chart: Frequency of categories
  const barFrequencyData = useMemo(() => {
    if (!cCol || rows.length === 0) return [];
    const counts = new Map<string, number>();
    for (const r of rows) {
      const val = String(r[cCol.id] || '').trim();
      if (!val) continue;
      counts.set(val, (counts.get(val) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([label, count]) => ({
      label,
      value: count,
      unit: 'sinh viên',
    }));
  }, [cCol, rows]);

  // 2. Data for Bar Chart: Mean of Quantitative Var by Group
  const barMeanByGroupData = useMemo(() => {
    if (!qCol1 || !cCol || rows.length === 0) return [];
    const groupMap = new Map<string, number[]>();

    for (const r of rows) {
      const gName = String(r[cCol.id] || '').trim();
      const rawVal = r[qCol1.id];
      if (!gName || rawVal === undefined || rawVal === null || String(rawVal).trim() === '') continue;
      const num = Number(String(rawVal).replace(',', '.'));
      if (!isNaN(num) && isFinite(num)) {
        if (!groupMap.has(gName)) groupMap.set(gName, []);
        groupMap.get(gName)!.push(num);
      }
    }

    return Array.from(groupMap.entries()).map(([label, vals]) => {
      const n = vals.length;
      const mean = vals.reduce((a, b) => a + b, 0) / n;
      const variance = n > 1 ? vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1) : 0;
      const sd = Math.sqrt(variance);
      return {
        label,
        mean: Number(mean.toFixed(2)),
        sd: Number(sd.toFixed(2)),
        count: n,
        unit: qCol1.unit || '',
      };
    });
  }, [qCol1, cCol, rows]);

  // 3. Data for Scatter Plot
  const scatterData = useMemo(() => {
    if (!qCol1 || !qCol2 || rows.length === 0) return null;
    const points: { x: number; y: number; label: string }[] = [];
    const xVals: number[] = [];
    const yVals: number[] = [];

    rows.forEach((r, idx) => {
      const rx = r[qCol1.id];
      const ry = r[qCol2.id];
      if (rx === undefined || ry === undefined || rx === null || ry === null) return;
      const nx = Number(String(rx).replace(',', '.'));
      const ny = Number(String(ry).replace(',', '.'));
      if (!isNaN(nx) && !isNaN(ny) && isFinite(nx) && isFinite(ny)) {
        points.push({ x: nx, y: ny, label: `SV #${idx + 1}` });
        xVals.push(nx);
        yVals.push(ny);
      }
    });

    if (points.length < 2) return null;
    const corr = calculateCorrelation(xVals, yVals);

    return {
      points,
      corr,
      minX: Math.min(...xVals),
      maxX: Math.max(...xVals),
      minY: Math.min(...yVals),
      maxY: Math.max(...yVals),
    };
  }, [qCol1, qCol2, rows]);

  // 4. Data for Histogram
  const histogramData = useMemo(() => {
    if (!qCol1 || rows.length === 0) return null;
    const vals: number[] = [];
    for (const r of rows) {
      const raw = r[qCol1.id];
      if (raw === undefined || raw === null || String(raw).trim() === '') continue;
      const n = Number(String(raw).replace(',', '.'));
      if (!isNaN(n) && isFinite(n)) vals.push(n);
    }
    if (vals.length < 2) return null;

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const binCount = Math.max(3, Math.min(histBinsCount, vals.length));
    const binSize = range / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => {
      const start = min + i * binSize;
      const end = i === binCount - 1 ? max : start + binSize;
      return {
        index: i,
        start: Number(start.toFixed(2)),
        end: Number(end.toFixed(2)),
        count: 0,
      };
    });

    for (const v of vals) {
      let bIdx = Math.floor((v - min) / binSize);
      if (bIdx >= binCount) bIdx = binCount - 1;
      if (bIdx < 0) bIdx = 0;
      bins[bIdx].count++;
    }

    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (vals.length - 1));

    return {
      bins,
      min,
      max,
      totalN: vals.length,
      mean: Number(mean.toFixed(2)),
      sd: Number(sd.toFixed(2)),
      maxCount: Math.max(...bins.map((b) => b.count)),
    };
  }, [qCol1, rows, histBinsCount]);

  // 5. Data for Box Plot
  const boxPlotData = useMemo(() => {
    if (!qCol1 || rows.length === 0) return [];

    if (!cCol) {
      // Single box plot for entire dataset
      const vals = rows
        .map((r) => Number(String(r[qCol1.id] || '').replace(',', '.')))
        .filter((n) => !isNaN(n) && isFinite(n));
      const stats = calculateDescriptiveStats(vals, qCol1.id, qCol1.name, qCol1.unit);
      if (!stats) return [];
      return [
        {
          group: 'Toàn bộ sinh viên',
          min: stats.min,
          q1: stats.q1,
          median: stats.median,
          q3: stats.q3,
          max: stats.max,
          outliers: vals.filter((v) => v < stats.q1 - 1.5 * stats.iqr || v > stats.q3 + 1.5 * stats.iqr),
          n: stats.validN,
        },
      ];
    } else {
      // Box plot by group
      const groups = new Map<string, number[]>();
      for (const r of rows) {
        const gName = String(r[cCol.id] || '').trim();
        const raw = r[qCol1.id];
        if (!gName || raw === undefined || raw === null || String(raw).trim() === '') continue;
        const n = Number(String(raw).replace(',', '.'));
        if (!isNaN(n) && isFinite(n)) {
          if (!groups.has(gName)) groups.set(gName, []);
          groups.get(gName)!.push(n);
        }
      }

      const results = [];
      for (const [gName, vals] of groups.entries()) {
        const stats = calculateDescriptiveStats(vals, qCol1.id, gName, qCol1.unit);
        if (stats && stats.validN >= 2) {
          results.push({
            group: gName,
            min: stats.min,
            q1: stats.q1,
            median: stats.median,
            q3: stats.q3,
            max: stats.max,
            outliers: vals.filter((v) => v < stats.q1 - 1.5 * stats.iqr || v > stats.q3 + 1.5 * stats.iqr),
            n: stats.validN,
          });
        }
      }
      return results;
    }
  }, [qCol1, cCol, rows]);

  // 6. Data for Line Chart
  const lineChartData = useMemo(() => {
    if (!qCol1 || rows.length === 0) return [];
    const points: { index: number; value: number; label: string }[] = [];
    rows.forEach((r, idx) => {
      const raw = r[qCol1.id];
      if (raw === undefined || raw === null || String(raw).trim() === '') return;
      const n = Number(String(raw).replace(',', '.'));
      if (!isNaN(n) && isFinite(n)) {
        points.push({ index: idx + 1, value: n, label: `SV #${idx + 1}` });
      }
    });
    return points;
  }, [qCol1, rows]);

  // Download chart as SVG
  const handleExportSVG = () => {
    const svgElement = document.getElementById('statxai-svg-chart');
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statxai-chart-${chartType}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Trực quan hóa Biểu đồ Thống kê</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tạo biểu đồ trực quan từ dữ liệu sinh viên đã nhập. Tự động cập nhật khi số liệu thay đổi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSVG}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
              title="Xuất biểu đồ vector định dạng SVG độ nét cao"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Xuất SVG</span>
            </button>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setChartType('bar')}
            className={`p-3 rounded-xl border text-left transition-all ${
              chartType === 'bar'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>Biểu đồ Cột</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">So sánh trung bình / Tần số nhóm</div>
          </button>

          <button
            onClick={() => setChartType('scatter')}
            className={`p-3 rounded-xl border text-left transition-all ${
              chartType === 'scatter'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Phân tán (Scatter)</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tương quan 2 biến & hồi quy</div>
          </button>

          <button
            onClick={() => setChartType('histogram')}
            className={`p-3 rounded-xl border text-left transition-all ${
              chartType === 'histogram'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Histogram</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Phân phối tần số thể lực</div>
          </button>

          <button
            onClick={() => setChartType('box')}
            className={`p-3 rounded-xl border text-left transition-all ${
              chartType === 'box'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Biểu đồ Hộp</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tứ phân vị & Điểm ngoại lai</div>
          </button>

          <button
            onClick={() => setChartType('line')}
            className={`p-3 rounded-xl border text-left transition-all ${
              chartType === 'line'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <LineChart className="w-4 h-4 text-blue-600" />
              <span>Biểu đồ Đường</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Diễn biến theo cá nhân</div>
          </button>
        </div>

        {/* Dynamic Controls based on selected Chart Type */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
          {chartType === 'bar' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Chế độ biểu đồ:</span>
                <select
                  value={barMode}
                  onChange={(e) => setBarMode(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value="mean_by_group">So sánh giá trị trung bình theo nhóm</option>
                  <option value="frequency">Tần số xuất hiện (số SV theo nhóm)</option>
                </select>
              </div>

              {barMode === 'mean_by_group' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Biến định lượng (trục Y):</span>
                    <select
                      value={quantVar1}
                      onChange={(e) => setQuantVar1(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                    >
                      {quantitativeColumns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.unit ? `(${c.unit})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Biến phân loại nhóm (trục X):</span>
                    <select
                      value={catVar}
                      onChange={(e) => setCatVar(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                    >
                      {categoricalColumns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Biến phân loại (trục X):</span>
                  <select
                    value={catVar}
                    onChange={(e) => setCatVar(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                  >
                    {categoricalColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {chartType === 'scatter' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Trục X (Biến độc lập):</span>
                <select
                  value={quantVar1}
                  onChange={(e) => setQuantVar1(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  {quantitativeColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.unit ? `(${c.unit})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Trục Y (Biến phụ thuộc):</span>
                <select
                  value={quantVar2}
                  onChange={(e) => setQuantVar2(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  {quantitativeColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.unit ? `(${c.unit})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {chartType === 'histogram' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Biến phân phối:</span>
                <select
                  value={quantVar1}
                  onChange={(e) => setQuantVar1(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  {quantitativeColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.unit ? `(${c.unit})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Số khoảng phân chia (Bins):</span>
                <select
                  value={histBinsCount}
                  onChange={(e) => setHistBinsCount(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value={4}>4 khoảng</option>
                  <option value={6}>6 khoảng</option>
                  <option value={8}>8 khoảng</option>
                  <option value={10}>10 khoảng</option>
                  <option value={15}>15 khoảng</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNormalCurve}
                  onChange={(e) => setShowNormalCurve(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Hiện đường cong phân phối chuẩn lý thuyết</span>
              </label>
            </div>
          )}

          {chartType === 'box' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Biến định lượng:</span>
                <select
                  value={quantVar1}
                  onChange={(e) => setQuantVar1(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  {quantitativeColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.unit ? `(${c.unit})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Tách theo nhóm:</span>
                <select
                  value={catVar}
                  onChange={(e) => setCatVar(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value="">(Không tách nhóm - toàn bộ mẫu)</option>
                  {categoricalColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {chartType === 'line' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Biến theo dõi:</span>
                <select
                  value={quantVar1}
                  onChange={(e) => setQuantVar1(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  {quantitativeColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.unit ? `(${c.unit})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chart Canvas / SVG Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 relative min-h-[460px] flex flex-col justify-between">
        {rows.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base">Bảng dữ liệu đang trống</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Biểu đồ chỉ được dựng từ số liệu thực tế do bạn nhập. Hãy quay lại tab "Nhập dữ liệu" để thêm các dòng sinh viên.
            </p>
            <button
              onClick={onOpenDataTab}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
            >
              Đến tab Nhập dữ liệu
            </button>
          </div>
        ) : (
          <div>
            {/* SVG Renderings */}
            {chartType === 'bar' && (
              <div>
                {barMode === 'mean_by_group' ? (
                  barMeanByGroupData.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-500">
                      Không có đủ dữ liệu nhóm hoặc biến định lượng để vẽ biểu đồ so sánh trung bình.
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 text-center">
                        <h4 className="font-bold text-slate-900 text-sm">
                          So sánh giá trị trung bình chỉ số {qCol1?.name} theo {cCol?.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          (Thanh nét đứng biểu diễn sai số độ lệch chuẩn ±1 SD)
                        </p>
                      </div>

                      <div className="relative w-full overflow-x-auto">
                        <svg
                          id="statxai-svg-chart"
                          viewBox="0 0 760 380"
                          className="w-full max-w-3xl mx-auto h-auto select-none"
                        >
                          {/* Grid and Axes */}
                          <line x1="80" y1="30" x2="80" y2="310" stroke="#cbd5e1" strokeWidth="2" />
                          <line x1="80" y1="310" x2="720" y2="310" stroke="#cbd5e1" strokeWidth="2" />

                          {/* Calculate scales */}
                          {(() => {
                            const maxVal = Math.max(...barMeanByGroupData.map((d) => d.mean + d.sd), 1);
                            const topTick = Math.ceil(maxVal * 1.15);
                            const tickCount = 5;
                            const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
                              Number(((topTick / tickCount) * i).toFixed(1))
                            );

                            const chartW = 620;
                            const barSlot = chartW / barMeanByGroupData.length;
                            const barWidth = Math.min(60, barSlot * 0.55);

                            return (
                              <>
                                {/* Y-axis Ticks */}
                                {yTicks.map((tick) => {
                                  const yPos = 310 - (tick / topTick) * 270;
                                  return (
                                    <g key={tick}>
                                      <line x1="75" y1={yPos} x2="720" y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                                      <text x="70" y={yPos + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
                                        {tick}
                                      </text>
                                    </g>
                                  );
                                })}

                                {/* Y-axis label */}
                                <text
                                  x="-170"
                                  y="25"
                                  transform="rotate(-90)"
                                  textAnchor="middle"
                                  className="text-xs fill-slate-600 font-semibold"
                                >
                                  {qCol1?.name} {qCol1?.unit ? `(${qCol1.unit})` : ''}
                                </text>

                                {/* Bars */}
                                {barMeanByGroupData.map((d, idx) => {
                                  const xCenter = 80 + idx * barSlot + barSlot / 2;
                                  const barHeight = (d.mean / topTick) * 270;
                                  const yTop = 310 - barHeight;
                                  const sdHeight = (d.sd / topTick) * 270;

                                  return (
                                    <g
                                      key={d.label}
                                      className="cursor-pointer group"
                                      onMouseEnter={(e) =>
                                        setHoveredPoint({
                                          x: e.clientX,
                                          y: e.clientY,
                                          content: `Nhóm: ${d.label} | X̄ = ${d.mean} ${d.unit} (SD = ${d.sd}, N = ${d.count})`,
                                        })
                                      }
                                      onMouseLeave={() => setHoveredPoint(null)}
                                    >
                                      {/* Bar */}
                                      <rect
                                        x={xCenter - barWidth / 2}
                                        y={yTop}
                                        width={barWidth}
                                        height={barHeight}
                                        rx="4"
                                        fill="url(#blueGrad)"
                                        className="transition-all hover:opacity-90"
                                      />

                                      {/* Value label on top of bar */}
                                      <text
                                        x={xCenter}
                                        y={yTop - 8}
                                        textAnchor="middle"
                                        className="text-[11px] fill-slate-900 font-bold font-mono"
                                      >
                                        {d.mean}
                                      </text>

                                      {/* Error bar for SD */}
                                      {d.sd > 0 && (
                                        <g stroke="#1e293b" strokeWidth="1.5">
                                          <line
                                            x1={xCenter}
                                            y1={Math.max(25, yTop - sdHeight)}
                                            x2={xCenter}
                                            y2={Math.min(310, yTop + sdHeight)}
                                          />
                                          <line
                                            x1={xCenter - 6}
                                            y1={Math.max(25, yTop - sdHeight)}
                                            x2={xCenter + 6}
                                            y2={Math.max(25, yTop - sdHeight)}
                                          />
                                          <line
                                            x1={xCenter - 6}
                                            y1={Math.min(310, yTop + sdHeight)}
                                            x2={xCenter + 6}
                                            y2={Math.min(310, yTop + sdHeight)}
                                          />
                                        </g>
                                      )}

                                      {/* X-axis category label */}
                                      <text
                                        x={xCenter}
                                        y="330"
                                        textAnchor="middle"
                                        className="text-xs fill-slate-800 font-semibold"
                                      >
                                        {d.label}
                                      </text>
                                      <text
                                        x={xCenter}
                                        y="346"
                                        textAnchor="middle"
                                        className="text-[10px] fill-slate-400 font-normal"
                                      >
                                        (n = {d.count})
                                      </text>
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}

                          <defs>
                            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  )
                ) : (
                  /* Frequency Bar Chart */
                  barFrequencyData.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-500">
                      Không có dữ liệu phân loại để thể hiện tần số sinh viên.
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 text-center">
                        <h4 className="font-bold text-slate-900 text-sm">
                          Tần số sinh viên phân bố theo biến "{cCol?.name}"
                        </h4>
                      </div>

                      <div className="relative w-full overflow-x-auto">
                        <svg
                          id="statxai-svg-chart"
                          viewBox="0 0 760 380"
                          className="w-full max-w-3xl mx-auto h-auto select-none"
                        >
                          <line x1="80" y1="30" x2="80" y2="310" stroke="#cbd5e1" strokeWidth="2" />
                          <line x1="80" y1="310" x2="720" y2="310" stroke="#cbd5e1" strokeWidth="2" />

                          {(() => {
                            const maxCount = Math.max(...barFrequencyData.map((d) => d.value), 1);
                            const topTick = Math.ceil(maxCount * 1.2);
                            const tickCount = 4;
                            const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
                              Math.round((topTick / tickCount) * i)
                            );

                            const chartW = 620;
                            const barSlot = chartW / barFrequencyData.length;
                            const barWidth = Math.min(65, barSlot * 0.55);

                            return (
                              <>
                                {yTicks.map((tick) => {
                                  const yPos = 310 - (tick / topTick) * 270;
                                  return (
                                    <g key={tick}>
                                      <line x1="75" y1={yPos} x2="720" y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                                      <text x="70" y={yPos + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
                                        {tick}
                                      </text>
                                    </g>
                                  );
                                })}

                                <text
                                  x="-170"
                                  y="30"
                                  transform="rotate(-90)"
                                  textAnchor="middle"
                                  className="text-xs fill-slate-600 font-semibold"
                                >
                                  Số lượng sinh viên
                                </text>

                                {barFrequencyData.map((d, idx) => {
                                  const xCenter = 80 + idx * barSlot + barSlot / 2;
                                  const barHeight = (d.value / topTick) * 270;
                                  const yTop = 310 - barHeight;

                                  return (
                                    <g key={d.label} className="cursor-pointer">
                                      <rect
                                        x={xCenter - barWidth / 2}
                                        y={yTop}
                                        width={barWidth}
                                        height={barHeight}
                                        rx="4"
                                        fill="#0284c7"
                                      />
                                      <text
                                        x={xCenter}
                                        y={yTop - 6}
                                        textAnchor="middle"
                                        className="text-[11px] fill-slate-900 font-bold font-mono"
                                      >
                                        {d.value}
                                      </text>
                                      <text
                                        x={xCenter}
                                        y="330"
                                        textAnchor="middle"
                                        className="text-xs fill-slate-800 font-semibold"
                                      >
                                        {d.label}
                                      </text>
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Scatter Plot */}
            {chartType === 'scatter' && (
              <div>
                {!scatterData ? (
                  <div className="py-20 text-center text-xs text-slate-500">
                    Cần ít nhất 2 sinh viên có đầy đủ số liệu của 2 biến định lượng để vẽ biểu đồ phân tán.
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-center">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Mối liên hệ giữa {qCol1?.name} (trục X) và {qCol2?.name} (trục Y)
                      </h4>
                      {scatterData.corr && (
                        <div className="inline-flex items-center gap-3 mt-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                          <span>
                            Hệ số tương quan Pearson <strong>r = {scatterData.corr.r}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            R² = <strong>{scatterData.corr.r2}</strong>
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-blue-700">
                            {Math.abs(scatterData.corr.r) >= 0.7
                              ? 'Tương quan mạnh'
                              : Math.abs(scatterData.corr.r) >= 0.4
                              ? 'Tương quan vừa'
                              : 'Tương quan yếu'}
                            {scatterData.corr.r > 0 ? ' (thuận)' : ' (nghịch)'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative w-full overflow-x-auto">
                      <svg
                        id="statxai-svg-chart"
                        viewBox="0 0 760 380"
                        className="w-full max-w-3xl mx-auto h-auto select-none"
                      >
                        <line x1="80" y1="30" x2="80" y2="310" stroke="#cbd5e1" strokeWidth="2" />
                        <line x1="80" y1="310" x2="720" y2="310" stroke="#cbd5e1" strokeWidth="2" />

                        {(() => {
                          const padX = (scatterData.maxX - scatterData.minX) * 0.1 || 1;
                          const padY = (scatterData.maxY - scatterData.minY) * 0.1 || 1;
                          const minX = Math.floor(scatterData.minX - padX);
                          const maxX = Math.ceil(scatterData.maxX + padX);
                          const minY = Math.floor(scatterData.minY - padY);
                          const maxY = Math.ceil(scatterData.maxY + padY);

                          const scaleX = (x: number) => 80 + ((x - minX) / (maxX - minX)) * 620;
                          const scaleY = (y: number) => 310 - ((y - minY) / (maxY - minY)) * 270;

                          return (
                            <>
                              {/* Grid lines */}
                              {[0.25, 0.5, 0.75, 1].map((pct) => {
                                const yVal = minY + pct * (maxY - minY);
                                const yPos = scaleY(yVal);
                                return (
                                  <g key={pct}>
                                    <line x1="80" y1={yPos} x2="720" y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                                    <text x="70" y={yPos + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                                      {yVal.toFixed(1)}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Regression line */}
                              {scatterData.corr && (
                                <line
                                  x1={scaleX(minX)}
                                  y1={scaleY(scatterData.corr.slope * minX + scatterData.corr.intercept)}
                                  x2={scaleX(maxX)}
                                  y2={scaleY(scatterData.corr.slope * maxX + scatterData.corr.intercept)}
                                  stroke="#dc2626"
                                  strokeWidth="2"
                                  strokeDasharray="4 4"
                                />
                              )}

                              {/* Scatter points */}
                              {scatterData.points.map((pt, i) => {
                                const cx = scaleX(pt.x);
                                const cy = scaleY(pt.y);
                                return (
                                  <circle
                                    key={i}
                                    cx={cx}
                                    cy={cy}
                                    r="6"
                                    fill="#2563eb"
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                    className="cursor-pointer hover:r-8 hover:fill-indigo-600 transition-all"
                                    onMouseEnter={(e) =>
                                      setHoveredPoint({
                                        x: e.clientX,
                                        y: e.clientY,
                                        content: `${pt.label}: ${qCol1?.name}=${pt.x}, ${qCol2?.name}=${pt.y}`,
                                      })
                                    }
                                    onMouseLeave={() => setHoveredPoint(null)}
                                  />
                                );
                              })}

                              {/* Axis titles */}
                              <text x="400" y="350" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">
                                {qCol1?.name} {qCol1?.unit ? `(${qCol1.unit})` : ''}
                              </text>
                              <text
                                x="-170"
                                y="25"
                                transform="rotate(-90)"
                                textAnchor="middle"
                                className="text-xs fill-slate-700 font-semibold"
                              >
                                {qCol2?.name} {qCol2?.unit ? `(${qCol2.unit})` : ''}
                              </text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Histogram */}
            {chartType === 'histogram' && (
              <div>
                {!histogramData ? (
                  <div className="py-20 text-center text-xs text-slate-500">
                    Chưa có đủ dữ liệu số để vẽ biểu đồ phân phối tần số Histogram.
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-center">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Phân phối tần số chỉ số {qCol1?.name} (N = {histogramData.totalN}, X̄ = {histogramData.mean}, s = {histogramData.sd})
                      </h4>
                    </div>

                    <div className="relative w-full overflow-x-auto">
                      <svg
                        id="statxai-svg-chart"
                        viewBox="0 0 760 380"
                        className="w-full max-w-3xl mx-auto h-auto select-none"
                      >
                        <line x1="80" y1="30" x2="80" y2="310" stroke="#cbd5e1" strokeWidth="2" />
                        <line x1="80" y1="310" x2="720" y2="310" stroke="#cbd5e1" strokeWidth="2" />

                        {(() => {
                          const topCount = Math.ceil(histogramData.maxCount * 1.25) || 5;
                          const chartW = 620;
                          const binW = chartW / histogramData.bins.length;

                          return (
                            <>
                              {/* Y ticks */}
                              {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                                const countVal = Math.round(p * topCount);
                                const yPos = 310 - (countVal / topCount) * 270;
                                return (
                                  <g key={p}>
                                    <line x1="75" y1={yPos} x2="720" y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                                    <text x="70" y={yPos + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                                      {countVal}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Bars */}
                              {histogramData.bins.map((b, idx) => {
                                const xLeft = 80 + idx * binW;
                                const barH = (b.count / topCount) * 270;
                                const yTop = 310 - barH;

                                return (
                                  <g key={b.index}>
                                    <rect
                                      x={xLeft + 2}
                                      y={yTop}
                                      width={binW - 4}
                                      height={barH}
                                      fill="#3b82f6"
                                      opacity="0.85"
                                      rx="2"
                                      className="hover:opacity-100 transition-opacity"
                                    />
                                    <text
                                      x={xLeft + binW / 2}
                                      y={yTop - 6}
                                      textAnchor="middle"
                                      className="text-[11px] fill-slate-800 font-bold font-mono"
                                    >
                                      {b.count}
                                    </text>
                                    <text
                                      x={xLeft + binW / 2}
                                      y="328"
                                      textAnchor="middle"
                                      className="text-[10px] fill-slate-600 font-mono"
                                    >
                                      {b.start} - {b.end}
                                    </text>
                                  </g>
                                );
                              })}

                              <text x="400" y="355" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">
                                Khoảng giá trị {qCol1?.name} {qCol1?.unit ? `(${qCol1.unit})` : ''}
                              </text>
                              <text
                                x="-170"
                                y="25"
                                transform="rotate(-90)"
                                textAnchor="middle"
                                className="text-xs fill-slate-700 font-semibold"
                              >
                                Tần số (Số sinh viên)
                              </text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Box Plot */}
            {chartType === 'box' && (
              <div>
                {boxPlotData.length === 0 ? (
                  <div className="py-20 text-center text-xs text-slate-500">
                    Chưa có đủ số liệu để dựng biểu đồ hộp. Cần ít nhất 2 quan sát trong mỗi nhóm.
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-center">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Biểu đồ hộp (Box Plot) thể hiện phân bố và độ phân tán {qCol1?.name}
                      </h4>
                    </div>

                    <div className="relative w-full overflow-x-auto">
                      <svg
                        id="statxai-svg-chart"
                        viewBox="0 0 760 380"
                        className="w-full max-w-3xl mx-auto h-auto select-none"
                      >
                        <line x1="80" y1="30" x2="80" y2="310" stroke="#cbd5e1" strokeWidth="2" />
                        <line x1="80" y1="310" x2="720" y2="310" stroke="#cbd5e1" strokeWidth="2" />

                        {(() => {
                          const allMin = Math.min(...boxPlotData.map((d) => d.min));
                          const allMax = Math.max(...boxPlotData.map((d) => d.max));
                          const pad = (allMax - allMin) * 0.1 || 1;
                          const scaleMin = allMin - pad;
                          const scaleMax = allMax + pad;

                          const scaleY = (val: number) => 310 - ((val - scaleMin) / (scaleMax - scaleMin)) * 270;

                          const chartW = 620;
                          const slotW = chartW / boxPlotData.length;
                          const boxW = Math.min(50, slotW * 0.45);

                          return (
                            <>
                              {/* Y ticks */}
                              {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                                const val = scaleMin + p * (scaleMax - scaleMin);
                                const yPos = scaleY(val);
                                return (
                                  <g key={p}>
                                    <line x1="75" y1={yPos} x2="720" y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                                    <text x="70" y={yPos + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                                      {val.toFixed(1)}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Box plots */}
                              {boxPlotData.map((b, idx) => {
                                const xCenter = 80 + idx * slotW + slotW / 2;
                                const yMin = scaleY(b.min);
                                const yQ1 = scaleY(b.q1);
                                const yMed = scaleY(b.median);
                                const yQ3 = scaleY(b.q3);
                                const yMax = scaleY(b.max);

                                return (
                                  <g key={b.group}>
                                    {/* Whisker line */}
                                    <line x1={xCenter} y1={yMin} x2={xCenter} y2={yMax} stroke="#64748b" strokeWidth="1.5" />
                                    <line x1={xCenter - 10} y1={yMin} x2={xCenter + 10} y2={yMin} stroke="#64748b" strokeWidth="1.5" />
                                    <line x1={xCenter - 10} y1={yMax} x2={xCenter + 10} y2={yMax} stroke="#64748b" strokeWidth="1.5" />

                                    {/* IQR Box (Q1 to Q3) */}
                                    <rect
                                      x={xCenter - boxW / 2}
                                      y={yQ3}
                                      width={boxW}
                                      height={Math.max(2, yQ1 - yQ3)}
                                      fill="#dbeafe"
                                      stroke="#2563eb"
                                      strokeWidth="2"
                                      rx="2"
                                    />

                                    {/* Median Line */}
                                    <line
                                      x1={xCenter - boxW / 2}
                                      y1={yMed}
                                      x2={xCenter + boxW / 2}
                                      y2={yMed}
                                      stroke="#1e3a8a"
                                      strokeWidth="3"
                                    />

                                    {/* Labels */}
                                    <text x={xCenter} y="330" textAnchor="middle" className="text-xs fill-slate-800 font-semibold">
                                      {b.group}
                                    </text>
                                    <text x={xCenter} y="346" textAnchor="middle" className="text-[10px] fill-slate-400">
                                      (n = {b.n}, med = {b.median})
                                    </text>
                                  </g>
                                );
                              })}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Line Chart */}
            {chartType === 'line' && (
              <div>
                {lineChartData.length < 2 ? (
                  <div className="py-20 text-center text-xs text-slate-500">
                    Cần ít nhất 2 sinh viên để vẽ biểu đồ đường biến thiên.
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-center">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Diễn biến chỉ số {qCol1?.name} qua các sinh viên theo thứ tự
                      </h4>
                    </div>

                    <div className="relative w-full overflow-x-auto">
                      <svg
                        id="statxai-svg-chart"
                        viewBox="0 0 760 380"
                        className="w-full max-w-3xl mx-auto h-auto select-none"
                      >
                        <line x1="80" y1="30" x2="80" y2="310" stroke="#cbd5e1" strokeWidth="2" />
                        <line x1="80" y1="310" x2="720" y2="310" stroke="#cbd5e1" strokeWidth="2" />

                        {(() => {
                          const vals = lineChartData.map((d) => d.value);
                          const min = Math.min(...vals);
                          const max = Math.max(...vals);
                          const pad = (max - min) * 0.1 || 1;
                          const sMin = min - pad;
                          const sMax = max + pad;

                          const scaleX = (idx: number) =>
                            80 + ((idx - 1) / Math.max(1, lineChartData.length - 1)) * 620;
                          const scaleY = (v: number) => 310 - ((v - sMin) / (sMax - sMin)) * 270;

                          const pointsStr = lineChartData
                            .map((p) => `${scaleX(p.index)},${scaleY(p.value)}`)
                            .join(' ');

                          return (
                            <>
                              <polyline
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="2.5"
                                points={pointsStr}
                              />
                              {lineChartData.map((p) => (
                                <circle
                                  key={p.index}
                                  cx={scaleX(p.index)}
                                  cy={scaleY(p.value)}
                                  r="4.5"
                                  fill="#1d4ed8"
                                  stroke="#fff"
                                  strokeWidth="1.5"
                                  className="cursor-pointer hover:r-6 transition-all"
                                  onMouseEnter={(e) =>
                                    setHoveredPoint({
                                      x: e.clientX,
                                      y: e.clientY,
                                      content: `${p.label}: ${p.value} ${qCol1?.unit || ''}`,
                                    })
                                  }
                                  onMouseLeave={() => setHoveredPoint(null)}
                                />
                              ))}
                              <text x="400" y="345" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">
                                Thứ tự sinh viên (STT)
                              </text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Global Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="fixed pointer-events-none z-50 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg"
            style={{ left: hoveredPoint.x + 12, top: hoveredPoint.y - 30 }}
          >
            {hoveredPoint.content}
          </div>
        )}
      </div>
    </div>
  );
};
