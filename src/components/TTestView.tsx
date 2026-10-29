import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Copy,
  Download,
  GitCompare,
  HelpCircle,
  Info,
  Layers,
  Play,
  Sparkles,
  Users
} from 'lucide-react';
import { Column, RowData } from '../types';
import {
  calculateIndependentTTest,
  calculateOneSampleTTest,
  calculatePairedTTest
} from '../utils/statistics';
import { exportCustomTableToCSV } from '../utils/csv';

interface TTestViewProps {
  columns: Column[];
  rows: RowData[];
  onOpenDataTab: () => void;
}

export const TTestView: React.FC<TTestViewProps> = ({ columns, rows, onOpenDataTab }) => {
  const quantitativeColumns = columns.filter((c) => c.type === 'quantitative');
  const categoricalColumns = columns.filter((c) => c.type === 'categorical');

  // Sub-tabs: 'independent' | 'paired' | 'one_sample'
  const [subType, setSubType] = useState<'independent' | 'paired' | 'one_sample'>('independent');
  const [alpha, setAlpha] = useState<number>(0.05);

  // Independent t-test mode: from dataset or manual practice data
  const [useManualInput, setUseManualInput] = useState<boolean>(false);
  const [manualGroupAText, setManualGroupAText] = useState<string>('7, 8, 6, 9, 10');
  const [manualGroupBText, setManualGroupBText] = useState<string>('5, 6, 7, 5, 6');
  const [manualNameA, setManualNameA] = useState<string>('Nhóm A');
  const [manualNameB, setManualNameB] = useState<string>('Nhóm B');

  // Independent from Dataset
  const [depColId, setDepColId] = useState<string>(quantitativeColumns[0]?.id || '');
  const [groupColId, setGroupColId] = useState<string>(categoricalColumns[0]?.id || '');
  const [groupValA, setGroupValA] = useState<string>('');
  const [groupValB, setGroupValB] = useState<string>('');

  // Paired from Dataset
  const [pairedColBefore, setPairedColBefore] = useState<string>(quantitativeColumns[0]?.id || '');
  const [pairedColAfter, setPairedColAfter] = useState<string>(quantitativeColumns[1]?.id || quantitativeColumns[0]?.id || '');

  // One-sample
  const [oneSampleCol, setOneSampleCol] = useState<string>(quantitativeColumns[0]?.id || '');
  const [mu0, setMu0] = useState<number>(70);

  // Results state
  const [indepResult, setIndepResult] = useState<any>(null);
  const [pairedResult, setPairedResult] = useState<any>(null);
  const [oneSampleResult, setOneSampleResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedApa, setCopiedApa] = useState<boolean>(false);

  // Auto-detect groups for independent t-test
  const detectedGroupValues = useMemo(() => {
    if (!groupColId || rows.length === 0) return [];
    const setVals = new Set<string>();
    rows.forEach((r) => {
      const val = String(r[groupColId] || '').trim();
      if (val) setVals.add(val);
    });
    return Array.from(setVals);
  }, [groupColId, rows]);

  React.useEffect(() => {
    if (detectedGroupValues.length >= 2) {
      if (!groupValA || !detectedGroupValues.includes(groupValA)) setGroupValA(detectedGroupValues[0]);
      if (!groupValB || !detectedGroupValues.includes(groupValB)) setGroupValB(detectedGroupValues[1]);
    }
  }, [detectedGroupValues, groupValA, groupValB]);

  // Run Independent t-test
  const handleRunIndependent = () => {
    setErrorMessage(null);
    setIndepResult(null);

    let valsA: number[] = [];
    let valsB: number[] = [];
    let labelA = manualNameA;
    let labelB = manualNameB;

    if (useManualInput) {
      valsA = manualGroupAText
        .split(/[,;\s]+/)
        .map((s) => Number(s.trim().replace(',', '.')))
        .filter((n) => !isNaN(n) && isFinite(n));
      valsB = manualGroupBText
        .split(/[,;\s]+/)
        .map((s) => Number(s.trim().replace(',', '.')))
        .filter((n) => !isNaN(n) && isFinite(n));
    } else {
      const col = columns.find((c) => c.id === depColId);
      const gCol = columns.find((c) => c.id === groupColId);
      if (!col || !gCol || !groupValA || !groupValB) {
        setErrorMessage('Vui lòng chọn đầy đủ biến định lượng và 2 nhóm để so sánh.');
        return;
      }
      labelA = `${gCol.name}: ${groupValA}`;
      labelB = `${gCol.name}: ${groupValB}`;

      rows.forEach((r) => {
        const g = String(r[gCol.id] || '').trim();
        const raw = r[col.id];
        if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
          const num = Number(String(raw).replace(',', '.'));
          if (!isNaN(num) && isFinite(num)) {
            if (g === groupValA) valsA.push(num);
            if (g === groupValB) valsB.push(num);
          }
        }
      });
    }

    if (valsA.length < 2 || valsB.length < 2) {
      setErrorMessage(
        `Mỗi nhóm cần ít nhất 2 quan sát hợp lệ (Hiện có: ${labelA} = ${valsA.length}, ${labelB} = ${valsB.length}).`
      );
      return;
    }

    const res = calculateIndependentTTest(valsA, valsB, labelA, labelB, alpha);
    if ('error' in res) {
      setErrorMessage(res.error || 'Lỗi khi tính toán.');
    } else {
      setIndepResult(res);
    }
  };

  // Run Paired t-test
  const handleRunPaired = () => {
    setErrorMessage(null);
    setPairedResult(null);

    const cBefore = columns.find((c) => c.id === pairedColBefore);
    const cAfter = columns.find((c) => c.id === pairedColAfter);
    if (!cBefore || !cAfter) {
      setErrorMessage('Vui lòng chọn 2 cột biến đo trước và sau.');
      return;
    }

    const vBefore: number[] = [];
    const vAfter: number[] = [];

    rows.forEach((r) => {
      const rawB = r[cBefore.id];
      const rawA = r[cAfter.id];
      if (rawB !== undefined && rawA !== undefined && rawB !== '' && rawA !== '') {
        const nb = Number(String(rawB).replace(',', '.'));
        const na = Number(String(rawA).replace(',', '.'));
        if (!isNaN(nb) && !isNaN(na)) {
          vBefore.push(nb);
          vAfter.push(na);
        }
      }
    });

    if (vBefore.length < 2) {
      setErrorMessage('Cần ít nhất 2 sinh viên có đầy đủ số liệu cả 2 thời điểm để kiểm định theo cặp.');
      return;
    }

    const res = calculatePairedTTest(vBefore, vAfter, cBefore.name, cAfter.name, alpha);
    if ('error' in res) {
      setErrorMessage(res.error || 'Lỗi kiểm định.');
    } else {
      setPairedResult(res);
    }
  };

  // Run One-Sample t-test
  const handleRunOneSample = () => {
    setErrorMessage(null);
    setOneSampleResult(null);

    const col = columns.find((c) => c.id === oneSampleCol);
    if (!col) {
      setErrorMessage('Vui lòng chọn biến định lượng.');
      return;
    }

    const vals = rows
      .map((r) => Number(String(r[col.id] || '').replace(',', '.')))
      .filter((n) => !isNaN(n) && isFinite(n));

    if (vals.length < 2) {
      setErrorMessage('Cột biến cần ít nhất 2 quan sát số liệu hợp lệ.');
      return;
    }

    const res = calculateOneSampleTTest(vals, mu0, col.name, alpha);
    if ('error' in res) {
      setErrorMessage(res.error || 'Lỗi tính toán.');
    } else {
      setOneSampleResult(res);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedApa(true);
    setTimeout(() => setCopiedApa(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-600" />
              <span>Kiểm định t (Student's t-test)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              So sánh giá trị trung bình giữa 2 nhóm độc lập, 2 thời điểm lặp lại (trước - sau can thiệp), hoặc với một chuẩn thể lực cố định.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Mức ý nghĩa:</span>
            <select
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium"
            >
              <option value={0.05}>α = 0.05 (Độ tin cậy 95%)</option>
              <option value={0.01}>α = 0.01 (Độ tin cậy 99%)</option>
              <option value={0.1}>α = 0.10 (Độ tin cậy 90%)</option>
            </select>
          </div>
        </div>

        {/* 3 Sub-tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setSubType('independent');
              setErrorMessage(null);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              subType === 'independent'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="font-bold text-xs">1. Hai mẫu độc lập (Independent t-test)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">So sánh 2 nhóm đối tượng khác nhau (Thực nghiệm vs Đối chứng)</div>
          </button>

          <button
            onClick={() => {
              setSubType('paired');
              setErrorMessage(null);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              subType === 'paired'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="font-bold text-xs">2. Mẫu theo cặp (Paired Samples t-test)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Đo lường trên cùng sinh viên tại 2 thời điểm: Trước - Sau tập luyện</div>
          </button>

          <button
            onClick={() => {
              setSubType('one_sample');
              setErrorMessage(null);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              subType === 'one_sample'
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="font-bold text-xs">3. Một mẫu (One-Sample t-test)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">So sánh trung bình lớp với một chuẩn thể lực quốc gia định sẵn (μ₀)</div>
          </button>
        </div>

        {/* Dynamic Controls based on selected t-test type */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
          {subType === 'independent' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Nguồn dữ liệu so sánh 2 nhóm:</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      checked={!useManualInput}
                      onChange={() => setUseManualInput(false)}
                      className="text-blue-600"
                    />
                    <span>Lấy từ Bảng dữ liệu của bạn</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      checked={useManualInput}
                      onChange={() => setUseManualInput(true)}
                      className="text-blue-600"
                    />
                    <span>Thực hành nhanh (Gõ số liệu trực tiếp)</span>
                  </label>
                </div>
              </div>

              {!useManualInput ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Biến định lượng cần đo:</label>
                    <select
                      value={depColId}
                      onChange={(e) => setDepColId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                    >
                      {quantitativeColumns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.unit ? `(${c.unit})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Cột phân nhóm:</label>
                    <select
                      value={groupColId}
                      onChange={(e) => setGroupColId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                    >
                      {categoricalColumns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Chọn 2 nhóm để kiểm định:</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={groupValA}
                        onChange={(e) => setGroupValA(e.target.value)}
                        className="w-1/2 bg-white border border-slate-300 rounded-lg p-2 font-medium"
                      >
                        {detectedGroupValues.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <span className="text-slate-400 font-bold">vs</span>
                      <select
                        value={groupValB}
                        onChange={(e) => setGroupValB(e.target.value)}
                        className="w-1/2 bg-white border border-slate-300 rounded-lg p-2 font-medium"
                      >
                        {detectedGroupValues.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <input
                        type="text"
                        value={manualNameA}
                        onChange={(e) => setManualNameA(e.target.value)}
                        className="font-bold text-blue-700 bg-transparent border-b border-blue-200 focus:outline-hidden text-xs"
                      />
                      <span className="text-[10px] text-slate-400">Cách nhau bằng dấu phẩy hoặc khoảng trắng</span>
                    </div>
                    <input
                      type="text"
                      value={manualGroupAText}
                      onChange={(e) => setManualGroupAText(e.target.value)}
                      placeholder="7, 8, 6, 9, 10..."
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <input
                        type="text"
                        value={manualNameB}
                        onChange={(e) => setManualNameB(e.target.value)}
                        className="font-bold text-indigo-700 bg-transparent border-b border-indigo-200 focus:outline-hidden text-xs"
                      />
                      <span className="text-[10px] text-slate-400">Ví dụ bài tập: 5, 6, 7, 5, 6</span>
                    </div>
                    <input
                      type="text"
                      value={manualGroupBText}
                      onChange={(e) => setManualGroupBText(e.target.value)}
                      placeholder="5, 6, 7, 5, 6..."
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-1">
                <button
                  onClick={handleRunIndependent}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Chạy kiểm định t độc lập (Independent t-test)</span>
                </button>
              </div>
            </div>
          )}

          {subType === 'paired' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Biến đo LẦN 1 (Trước can thiệp):</label>
                  <select
                    value={pairedColBefore}
                    onChange={(e) => setPairedColBefore(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {quantitativeColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.unit ? `(${c.unit})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Biến đo LẦN 2 (Sau can thiệp):</label>
                  <select
                    value={pairedColAfter}
                    onChange={(e) => setPairedColAfter(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {quantitativeColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.unit ? `(${c.unit})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleRunPaired}
                  disabled={rows.length === 0}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Chạy kiểm định t theo cặp (Paired t-test)</span>
                </button>
              </div>
            </div>
          )}

          {subType === 'one_sample' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Biến định lượng khảo sát:</label>
                  <select
                    value={oneSampleCol}
                    onChange={(e) => setOneSampleCol(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {quantitativeColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.unit ? `(${c.unit})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Giá trị chuẩn tham chiếu (μ₀):</label>
                  <input
                    type="number"
                    value={mu0}
                    onChange={(e) => setMu0(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Ví dụ: Chuẩn thể lực bật xa 210cm, nhịp tim chuẩn 72 bpm</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleRunOneSample}
                  disabled={rows.length === 0}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Chạy kiểm định t một mẫu (One-Sample t-test)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Results Display for Independent t-test */}
      {subType === 'independent' && indepResult && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-blue-200 space-y-1">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{indepResult.nameA}</span>
              <div className="text-2xl font-black text-slate-900 font-mono">X̄₁ = {indepResult.mean1}</div>
              <div className="text-xs text-slate-500 font-mono">
                n₁ = {indepResult.n1} | s₁ = {indepResult.sd1} | s₁² = {indepResult.var1}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-200 space-y-1">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">{indepResult.nameB}</span>
              <div className="text-2xl font-black text-slate-900 font-mono">X̄₂ = {indepResult.mean2}</div>
              <div className="text-xs text-slate-500 font-mono">
                n₂ = {indepResult.n2} | s₂ = {indepResult.sd2} | s₂² = {indepResult.var2}
              </div>
            </div>
          </div>

          {/* Results Comparison Table (Student vs Welch) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Bảng so sánh Kiểm định t (Student và Welch)</h3>
                <p className="text-xs text-slate-500">
                  Chênh lệch trung bình: X̄₁ - X̄₂ = <strong>{indepResult.diffMean}</strong> | Tỷ lệ phương sai s₁²/s₂² = <strong>{indepResult.varianceRatio}</strong>
                </p>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-slate-900">Phương pháp</th>
                    <th className="py-2.5 px-3 font-semibold">Sai số chuẩn (SE)</th>
                    <th className="py-2.5 px-3 font-bold text-blue-700 bg-blue-50/50">Thống kê t</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Bậc tự do (df)</th>
                    <th className="py-2.5 px-3 font-bold text-indigo-700 bg-indigo-50/50">P-value (2 phía)</th>
                    <th className="py-2.5 px-3 font-semibold">Khoảng tin cậy 95% (CI)</th>
                    <th className="py-2.5 px-3 font-semibold">Cỡ ảnh hưởng (Cohen's d)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>Student's t-test</div>
                      <span className="text-[10px] text-slate-400 font-normal">Giả định phương sai bằng nhau (Pooled)</span>
                    </td>
                    <td className="py-3 px-3 font-mono">{indepResult.seStudent}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700 bg-blue-50/30 text-sm">
                      {indepResult.tStudent}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{indepResult.dfStudent}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700 bg-indigo-50/30 text-sm">
                      {indepResult.pStudent < 0.0001 ? '< 0.0001' : indepResult.pStudent}
                    </td>
                    <td className="py-3 px-3 font-mono">[{indepResult.ciStudentLower}, {indepResult.ciStudentUpper}]</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">{indepResult.cohensD} (Rất lớn)</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>Welch's t-test</div>
                      <span className="text-[10px] text-slate-400 font-normal">Không đòi hỏi đồng nhất phương sai (Khuyên dùng)</span>
                    </td>
                    <td className="py-3 px-3 font-mono">{indepResult.seWelch}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700 bg-blue-50/30 text-sm">
                      {indepResult.tWelch}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{indepResult.dfWelch}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700 bg-indigo-50/30 text-sm">
                      {indepResult.pWelch < 0.0001 ? '< 0.0001' : indepResult.pWelch}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">-</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">{indepResult.cohensD}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* APA Format Reporting Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Mẫu câu báo cáo kết quả chuẩn APA (Tiếng Việt):</span>
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `Kết quả kiểm định t cho hai mẫu độc lập cho thấy có sự khác biệt có ý nghĩa thống kê giữa ${indepResult.nameA} (M = ${indepResult.mean1}, SD = ${indepResult.sd1}) và ${indepResult.nameB} (M = ${indepResult.mean2}, SD = ${indepResult.sd2}); t(${indepResult.dfStudent}) = ${indepResult.tStudent}, p = ${indepResult.pStudent}, 95% CI [${indepResult.ciStudentLower}, ${indepResult.ciStudentUpper}], d = ${indepResult.cohensD}.`
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedApa ? 'Đã sao chép!' : 'Sao chép APA'}</span>
              </button>
            </div>

            <p className="text-xs text-blue-50 font-serif leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/10">
              "Kết quả kiểm định t cho hai mẫu độc lập cho thấy có sự khác biệt có ý nghĩa thống kê giữa {indepResult.nameA} (M = {indepResult.mean1}, SD = {indepResult.sd1}) và {indepResult.nameB} (M = {indepResult.mean2}, SD = {indepResult.sd2}); t({indepResult.dfStudent}) = {indepResult.tStudent}, p = {indepResult.pStudent}, 95% CI [{indepResult.ciStudentLower}, {indepResult.ciStudentUpper}], d = {indepResult.cohensD}."
            </p>
          </div>
        </div>
      )}

      {/* Results Display for Paired t-test */}
      {subType === 'paired' && pairedResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Kết quả Kiểm định t theo cặp (Paired Samples t-test)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">Chênh lệch TB (d̄):</span>
              <span className="text-base font-bold text-slate-900">{pairedResult.meanDiff}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">Thống kê t:</span>
              <span className="text-base font-bold text-blue-700">{pairedResult.tStat}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">Bậc tự do (df):</span>
              <span className="text-base font-bold text-slate-900">{pairedResult.df}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">P-value:</span>
              <span className="text-base font-bold text-indigo-700">{pairedResult.pVal}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            {pairedResult.pVal < alpha
              ? `Bác bỏ H₀: Có sự thay đổi có ý nghĩa thống kê giữa thời điểm "${pairedResult.nameBefore}" và "${pairedResult.nameAfter}" (t(${pairedResult.df}) = ${pairedResult.tStat}, p = ${pairedResult.pVal}, Cohen's d = ${pairedResult.cohensD}).`
              : `Chưa đủ bằng chứng bác bỏ H₀: Không phát hiện sự sai khác có ý nghĩa thống kê giữa 2 lần đo.`}
          </p>
        </div>
      )}

      {/* Results Display for One-Sample t-test */}
      {subType === 'one_sample' && oneSampleResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Kết quả Kiểm định t một mẫu (One-Sample t-test)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">Trung bình mẫu (X̄):</span>
              <span className="text-base font-bold text-slate-900">{oneSampleResult.mean}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">Giá trị chuẩn (μ₀):</span>
              <span className="text-base font-bold text-slate-900">{oneSampleResult.mu0}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">Thống kê t:</span>
              <span className="text-base font-bold text-blue-700">{oneSampleResult.tStat}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 font-sans block text-[11px]">P-value:</span>
              <span className="text-base font-bold text-indigo-700">{oneSampleResult.pVal}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            {oneSampleResult.pVal < alpha
              ? `Bác bỏ H₀: Trung bình chỉ số ${oneSampleResult.varName} của nhóm sinh viên khác biệt có ý nghĩa thống kê so với mức chuẩn μ₀ = ${oneSampleResult.mu0} (t(${oneSampleResult.df}) = ${oneSampleResult.tStat}, p = ${oneSampleResult.pVal}).`
              : `Chưa đủ bằng chứng bác bỏ H₀: Không phát hiện sự khác biệt có ý nghĩa thống kê so với chuẩn tham chiếu.`}
          </p>
        </div>
      )}
    </div>
  );
};
