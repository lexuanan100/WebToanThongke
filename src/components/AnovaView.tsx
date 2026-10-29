import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  HelpCircle,
  Info,
  Layers,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Users
} from 'lucide-react';
import { AnovaResult, Column, RowData } from '../types';
import { calculateOneWayANOVA } from '../utils/statistics';
import { exportCustomTableToCSV } from '../utils/csv';

interface AnovaViewProps {
  columns: Column[];
  rows: RowData[];
  onOpenDataTab: () => void;
  onOpenAiExplain?: (analysisType: string, statsData: any) => void;
}

export const AnovaView: React.FC<AnovaViewProps> = ({
  columns,
  rows,
  onOpenDataTab,
  onOpenAiExplain,
}) => {
  const quantitativeColumns = columns.filter((c) => c.type === 'quantitative');
  const categoricalColumns = columns.filter((c) => c.type === 'categorical');

  // Step 1: Selected variables
  const [selectedDepVar, setSelectedDepVar] = useState<string>(quantitativeColumns[0]?.id || '');
  const [selectedGroupVar, setSelectedGroupVar] = useState<string>(categoricalColumns[0]?.id || '');

  // Step 2: Detected groups and user selection
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);

  // Step 3: Significance level alpha
  const [alpha, setAlpha] = useState<number>(0.05);

  // Results & Errors
  const [anovaResult, setAnovaResult] = useState<AnovaResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [showWelch, setShowWelch] = useState<boolean>(false);
  const [showAssumptionsModal, setShowAssumptionsModal] = useState<boolean>(false);

  // Synchronize variable defaults
  React.useEffect(() => {
    if (!selectedDepVar && quantitativeColumns.length > 0) {
      setSelectedDepVar(quantitativeColumns[0].id);
    }
    if (!selectedGroupVar && categoricalColumns.length > 0) {
      setSelectedGroupVar(categoricalColumns[0].id);
    }
  }, [quantitativeColumns, categoricalColumns, selectedDepVar, selectedGroupVar]);

  // Detected groups in current dataset based on selected groupVar
  const detectedGroupsSummary = useMemo(() => {
    if (!selectedGroupVar || rows.length === 0) return [];
    const groupCountMap = new Map<string, number>();

    for (const r of rows) {
      const g = String(r[selectedGroupVar] || '').trim();
      if (!g) continue;
      groupCountMap.set(g, (groupCountMap.get(g) || 0) + 1);
    }

    return Array.from(groupCountMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [selectedGroupVar, rows]);

  // Update selected groups whenever detected groups change
  React.useEffect(() => {
    setSelectedGroupNames(detectedGroupsSummary.map((g) => g.name));
  }, [detectedGroupsSummary]);

  const toggleGroupSelection = (groupName: string) => {
    setSelectedGroupNames((prev) =>
      prev.includes(groupName) ? prev.filter((n) => n !== groupName) : [...prev, groupName]
    );
  };

  // Run ANOVA
  const handleRunAnova = () => {
    setCalcError(null);
    setAnovaResult(null);

    const depCol = columns.find((c) => c.id === selectedDepVar);
    const groupCol = columns.find((c) => c.id === selectedGroupVar);

    if (!depCol || !groupCol) {
      setCalcError('Vui lòng chọn đầy đủ biến định lượng và biến phân nhóm.');
      return;
    }

    if (selectedGroupNames.length < 2) {
      setCalcError('Phân tích ANOVA yêu cầu chọn ít nhất 2 nhóm sinh viên.');
      return;
    }

    // Organize raw values by group
    const groupsData = selectedGroupNames.map((gName) => {
      const groupRows = rows.filter((r) => String(r[groupCol.id] || '').trim() === gName);
      const values = groupRows.map((r) => r[depCol.id]);
      return {
        name: gName,
        values,
      };
    });

    const { result, error } = calculateOneWayANOVA(groupsData, depCol.name, groupCol.name, alpha);

    if (error) {
      setCalcError(error);
    } else if (result) {
      setAnovaResult(result);
    }
  };

  // Export ANOVA summary to CSV
  const handleExportAnovaCSV = () => {
    if (!anovaResult) return;

    const headers = [
      'Nguồn biến thiên',
      'Tổng bình phương (SS)',
      'Bậc tự do (df)',
      'Bình phương TB (MS)',
      'Giá trị F',
      'P-value',
      'F tới hạn (F_crit)',
      'Mức ý nghĩa alpha',
    ];

    const dataRows = [
      [
        'Giữa các nhóm (Between Groups)',
        anovaResult.ssBetween,
        anovaResult.dfBetween,
        anovaResult.msBetween,
        anovaResult.fValue,
        anovaResult.pValue,
        anovaResult.fCrit,
        anovaResult.alpha,
      ],
      [
        'Trong nội bộ nhóm (Within Groups / Error)',
        anovaResult.ssWithin,
        anovaResult.dfWithin,
        anovaResult.msWithin,
        '',
        '',
        '',
        '',
      ],
      ['Tổng cộng (Total)', anovaResult.ssTotal, anovaResult.dfTotal, '', '', '', '', ''],
    ];

    exportCustomTableToCSV(headers, dataRows, `statxai-anova-${anovaResult.dependentVarName}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Steps Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Phân tích Phương sai ANOVA một yếu tố (One-Way ANOVA)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              So sánh sự khác biệt về chỉ số thể lực giữa các nhóm sinh viên (ví dụ: nhóm thực nghiệm giáo trình khác nhau, các lớp, hoặc các mức tần suất tập).
            </p>
          </div>

          <button
            onClick={() => setShowAssumptionsModal(!showAssumptionsModal)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>3 Giả định của ANOVA</span>
            {showAssumptionsModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Assumptions Guidance Banner */}
        {showAssumptionsModal && (
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-800 space-y-3">
            <div className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>3 Điều kiện (Giả định) tiên quyết để kết quả ANOVA có giá trị khoa học:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900">1. Tính độc lập của mẫu:</span>
                <p className="text-slate-600">
                  Dữ liệu thể lực của mỗi sinh viên phải được đo độc lập, không có sinh viên nào tham gia đồng thời 2 nhóm đối chiếu.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900">2. Phân phối chuẩn:</span>
                <p className="text-slate-600">
                  Chỉ số thể lực của mỗi nhóm sinh viên cần có phân phối xấp xỉ chuẩn (kiểm tra qua độ đối xứng và biểu đồ Histogram).
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900">3. Tính đồng nhất phương sai:</span>
                <p className="text-slate-600">
                  Phương sai thể lực giữa các nhóm phải tương đồng. Nếu phương sai quá chênh lệch, hệ thống cung cấp tùy chọn Welch ANOVA.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification of columns */}
        {quantitativeColumns.length === 0 || categoricalColumns.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Chưa đủ điều kiện biến:</strong> Kiểm định ANOVA yêu cầu có ít nhất:{' '}
              <strong>1 cột định lượng</strong> (chỉ số thể lực cần so sánh) và{' '}
              <strong>1 cột phân loại</strong> (tên nhóm hoặc lớp học).{' '}
              <button
                onClick={onOpenDataTab}
                className="underline font-bold text-blue-700 hover:text-blue-800 ml-1"
              >
                Vào tab "Nhập dữ liệu" để điều chỉnh loại biến.
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Step 1: Select Variables */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Biến định lượng cần so sánh (Biến phụ thuộc Y) *
                </label>
                <select
                  value={selectedDepVar}
                  onChange={(e) => setSelectedDepVar(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                >
                  {quantitativeColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.unit ? `(${c.unit})` : ''}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ví dụ: Chống đẩy, Bật xa, Nhịp tim nghỉ, Chiều cao...
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Biến phân loại nhóm (Yếu tố Factor X) *
                </label>
                <select
                  value={selectedGroupVar}
                  onChange={(e) => setSelectedGroupVar(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                >
                  {categoricalColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ví dụ: Nhóm tập (Cardio/HIIT/Kiểm chứng), Lớp học, Giới tính...
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Mức ý nghĩa thống kê (α) *
                </label>
                <select
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                >
                  <option value={0.05}>α = 0.05 (Độ tin cậy 95% - Chuẩn GDTC)</option>
                  <option value={0.01}>α = 0.01 (Độ tin cậy 99% - Nghiêm ngặt)</option>
                  <option value={0.1}>α = 0.10 (Độ tin cậy 90% - Nghiên cứu thăm dò)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mặc định α = 0.05 theo tiêu chuẩn quốc tế
                </span>
              </div>
            </div>

            {/* Step 2: Auto-detected Groups in data */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Nhận diện tự động các nhóm trong cột phân loại ({detectedGroupsSummary.length} nhóm tìm thấy):
                </span>
                <span className="text-[11px] text-slate-500">
                  * Tích chọn nhóm bạn muốn đưa vào so sánh (tối thiểu 2 nhóm)
                </span>
              </div>

              {detectedGroupsSummary.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  Chưa có tên nhóm nào trong cột này. Vui lòng nhập dữ liệu tên nhóm vào bảng.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {detectedGroupsSummary.map((g) => {
                    const isChecked = selectedGroupNames.includes(g.name);
                    return (
                      <button
                        key={g.name}
                        onClick={() => toggleGroupSelection(g.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isChecked
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>{g.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isChecked ? 'bg-blue-700' : 'bg-slate-200'}`}>
                          n = {g.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Run Button & Errors */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleRunAnova}
                disabled={selectedGroupNames.length < 2 || rows.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Chạy phân tích ANOVA</span>
              </button>

              {rows.length === 0 && (
                <span className="text-xs text-rose-600 font-medium">
                  * Bảng dữ liệu chưa có dòng nào.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Calculation Error Notice */}
      {calcError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Không thể thực hiện kiểm định ANOVA:</strong>
            <p>{calcError}</p>
          </div>
        </div>
      )}

      {/* Main ANOVA Results Display */}
      {anovaResult && (
        <div className="space-y-6">
          {/* Section 1: Descriptive Stats per Group */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                1. Thống kê mô tả từng nhóm sinh viên đối chiếu (Biến: "{anovaResult.dependentVarName}")
              </h3>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Tên nhóm</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Số lượng (n)</th>
                    <th className="py-2.5 px-3 font-semibold text-blue-700 bg-blue-50/50">Trung bình (X̄)</th>
                    <th className="py-2.5 px-3 font-semibold text-indigo-700 bg-indigo-50/50">Độ lệch chuẩn (s)</th>
                    <th className="py-2.5 px-3 font-semibold">Phương sai (s²)</th>
                    <th className="py-2.5 px-3 font-semibold">Min</th>
                    <th className="py-2.5 px-3 font-semibold">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {anovaResult.groups.map((g) => (
                    <tr key={g.name} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{g.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{g.count}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 bg-blue-50/20">{g.mean}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 bg-indigo-50/20">{g.sd}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{g.variance}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{g.min}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{g.max}</td>
                    </tr>
                  ))}
                  {/* Grand total row */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td className="py-2.5 px-3">Toàn bộ sinh viên (Tổng hợp)</td>
                    <td className="py-2.5 px-3 text-center font-mono">{anovaResult.totalN}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-700">{anovaResult.grandMean}</td>
                    <td className="py-2.5 px-3 font-mono" colSpan={4}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: ANOVA Summary Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  2. Bảng Phân tích Phương sai ANOVA (ANOVA Summary Table)
                </h3>
                <p className="text-xs text-slate-500">
                  Mức ý nghĩa đã chọn: α = {anovaResult.alpha} (Độ tin cậy {(1 - anovaResult.alpha) * 100}%)
                </p>
              </div>

              <button
                onClick={handleExportAnovaCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Xuất bảng ANOVA</span>
              </button>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 font-bold text-slate-900">Nguồn biến thiên</th>
                    <th className="py-3 px-3 font-semibold" title="Tổng bình phương">
                      Tổng bình phương (SS)
                    </th>
                    <th className="py-3 px-3 text-center font-semibold" title="Bậc tự do">
                      Bậc tự do (df)
                    </th>
                    <th className="py-3 px-3 font-semibold" title="Bình phương trung bình = SS / df">
                      Bình phương TB (MS)
                    </th>
                    <th className="py-3 px-3 font-bold text-blue-700 bg-blue-50/50" title="Thống kê F = MS_between / MS_within">
                      Giá trị F
                    </th>
                    <th className="py-3 px-3 font-bold text-indigo-700 bg-indigo-50/50" title="Xác suất P-value">
                      P-value
                    </th>
                    <th className="py-3 px-3 font-semibold" title="Giá trị F tới hạn">
                      F tới hạn (F_crit)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      Giữa các nhóm (Between Groups / Factor)
                    </td>
                    <td className="py-3 px-3 font-mono">{anovaResult.ssBetween}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{anovaResult.dfBetween}</td>
                    <td className="py-3 px-3 font-mono">{anovaResult.msBetween}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700 bg-blue-50/30 text-sm">
                      {anovaResult.fValue}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700 bg-indigo-50/30 text-sm">
                      {anovaResult.pValue < 0.0001 ? '< 0.0001' : anovaResult.pValue}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{anovaResult.fCrit}</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-700">
                      Trong nội bộ nhóm (Within Groups / Error)
                    </td>
                    <td className="py-3 px-3 font-mono">{anovaResult.ssWithin}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{anovaResult.dfWithin}</td>
                    <td className="py-3 px-3 font-mono">{anovaResult.msWithin}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 bg-slate-50/30">-</td>
                    <td className="py-3 px-3 font-mono text-slate-400 bg-slate-50/30">-</td>
                    <td className="py-3 px-3 font-mono text-slate-400">-</td>
                  </tr>

                  <tr className="bg-slate-50 font-bold border-t border-slate-200">
                    <td className="py-3 px-3 text-slate-900">Tổng cộng (Total)</td>
                    <td className="py-3 px-3 font-mono">{anovaResult.ssTotal}</td>
                    <td className="py-3 px-3 text-center font-mono">{anovaResult.dfTotal}</td>
                    <td className="py-3 px-3 font-mono" colSpan={4}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Scientific Conclusion & Interpretation */}
          <div
            className={`p-6 rounded-2xl border shadow-xs space-y-4 ${
              anovaResult.pValue < anovaResult.alpha
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {anovaResult.pValue < anovaResult.alpha ? (
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-slate-600 text-white flex items-center justify-center shadow-xs">
                  <Info className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                  3. Kết luận thống kê sư phạm Giáo dục thể chất
                </span>
                <h4 className="text-base sm:text-lg font-bold">
                  {anovaResult.pValue < anovaResult.alpha
                    ? 'BÁC BỎ GIẢ THUYẾT H₀ – CÓ SỰ KHÁC BIỆT CÓ Ý NGHĨA THỐNG KÊ'
                    : 'CHƯA ĐỦ BẰNG CHỨNG BÁC BỎ H₀ – CHƯA THẤY KHÁC BIỆT CÓ Ý NGHĨA'}
                </h4>
              </div>
            </div>

            {/* Hypotheses Statement */}
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200/60 text-xs space-y-2">
              <div>
                <strong className="text-slate-900">• Giả thuyết không (H₀):</strong>{' '}
                <span className="text-slate-700">
                  μ₁ = μ₂ = ... = μₖ (Không có sự khác biệt về trung bình chỉ số thể lực "{anovaResult.dependentVarName}" giữa các nhóm của biến "{anovaResult.groupVarName}").
                </span>
              </div>
              <div>
                <strong className="text-slate-900">• Giả thuyết đối (H₁):</strong>{' '}
                <span className="text-slate-700">
                  Có ít nhất một cặp nhóm sinh viên có giá trị trung bình chỉ số "{anovaResult.dependentVarName}" khác biệt nhau.
                </span>
              </div>
              <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <span>
                  • Đối chiếu: P-value = <strong>{anovaResult.pValue}</strong>{' '}
                  {anovaResult.pValue < anovaResult.alpha ? '<' : '≥'} α = <strong>{anovaResult.alpha}</strong>
                </span>
                <span>•</span>
                <span>
                  F quan sát = <strong>{anovaResult.fValue}</strong>{' '}
                  {anovaResult.fValue > anovaResult.fCrit ? '>' : '≤'} F tới hạn = <strong>{anovaResult.fCrit}</strong>
                </span>
                <span>•</span>
                <span>
                  Kích thước hiệu ứng η² (Eta-squared) = <strong>{(anovaResult.etaSquared * 100).toFixed(1)}%</strong>
                </span>
              </div>
            </div>

            {/* Detailed Interpretation */}
            <p className="text-xs sm:text-sm leading-relaxed">{anovaResult.conclusion}</p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{anovaResult.detailedInterpretation}</p>

            {/* Causality Disclaimer */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý phương pháp luận trong Khoa học Thể dục Thể thao:</strong> Kết quả ANOVA chỉ phản ánh quan hệ thống kê trên mẫu đo được, không tự động chứng minh quan hệ nhân quả tuyệt đối. Người nghiên cứu cần kiểm soát thêm các yếu tố ngoại lai như chế độ dinh dưỡng, thời gian ngủ nghỉ, kinh nghiệm vận động trước đó của sinh viên.
              </div>
            </div>
          </div>

          {/* Section 4: Post-hoc Tukey HSD Pairwise Comparisons */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                4. Kiểm định hậu nghiệm Tukey HSD (So sánh từng cặp nhóm sinh viên)
              </h3>
              <p className="text-xs text-slate-500">
                Xác định chính xác cặp nhóm nào tạo nên sự sai khác có ý nghĩa thống kê (ngưỡng tới hạn q_crit = {anovaResult.tukeyResults[0]?.qCrit || 0})
              </p>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Cặp so sánh</th>
                    <th className="py-2.5 px-3 font-semibold">Chênh lệch trung bình (X̄₁ - X̄₂)</th>
                    <th className="py-2.5 px-3 font-semibold">Sai số chuẩn (SE)</th>
                    <th className="py-2.5 px-3 font-mono font-bold">Chỉ số q (Tukey)</th>
                    <th className="py-2.5 px-3 font-semibold">Khoảng tin cậy 95%</th>
                    <th className="py-2.5 px-3 font-bold text-center">Kết luận có ý nghĩa?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {anovaResult.tukeyResults.map((pair, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {pair.groupA} <span className="text-slate-400 font-normal">vs</span> {pair.groupB}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">
                        {pair.diff > 0 ? `+${pair.diff}` : pair.diff}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{pair.se}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{pair.qStat}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        [{pair.ciLower}, {pair.ciUpper}]
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {pair.isSignificant ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            Có khác biệt (p &lt; {anovaResult.alpha})
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">
                            Không khác biệt
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Assumptions & Welch ANOVA option */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  5. Kiểm tra giả định đồng nhất phương sai & Welch ANOVA
                </h3>
                <p className="text-xs text-slate-500">
                  Tỷ số phương sai lớn nhất / nhỏ nhất: <strong>{anovaResult.varianceRatio}</strong>.
                  {anovaResult.isHomogeneous
                    ? ' (Phương sai giữa các nhóm đạt mức tương đồng chấp nhận được).'
                    : ' (Phương sai các nhóm có sự phân tán lớn, khuyến nghị tham khảo thêm Welch ANOVA).'}
                </p>
              </div>

              {anovaResult.welchF !== undefined && (
                <button
                  onClick={() => setShowWelch(!showWelch)}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200"
                >
                  {showWelch ? 'Ẩn Welch ANOVA' : 'Xem kết quả Welch ANOVA'}
                </button>
              )}
            </div>

            {showWelch && anovaResult.welchF !== undefined && (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-2">
                <div className="font-bold text-sm">Kết quả kiểm định Welch ANOVA (Hiệu chỉnh phương sai không đều):</div>
                <div className="flex flex-wrap items-center gap-4">
                  <span>
                    Welch F* = <strong>{anovaResult.welchF}</strong>
                  </span>
                  <span>
                    df1 = <strong>{anovaResult.welchDf1}</strong>
                  </span>
                  <span>
                    df2 = <strong>{anovaResult.welchDf2}</strong>
                  </span>
                  <span>
                    Welch P-value ={' '}
                    <strong>
                      {anovaResult.welchPValue !== undefined && anovaResult.welchPValue < 0.0001
                        ? '< 0.0001'
                        : anovaResult.welchPValue}
                    </strong>
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Welch ANOVA là phép kiểm định vững (robust) không đòi hỏi giả định đồng nhất phương sai. Nếu P-value của Welch vẫn đồng thuận với ANOVA truyền thống, kết luận của nghiên cứu càng có độ tin cậy cao.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
