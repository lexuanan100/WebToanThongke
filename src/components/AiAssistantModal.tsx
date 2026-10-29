import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  HelpCircle,
  Info,
  Loader2,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { Column, RowData } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  rows: RowData[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  columns,
  rows,
}) => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [checkedStatus, setCheckedStatus] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseHtml, setResponseHtml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check API status when opening
  useEffect(() => {
    if (isOpen) {
      fetch('/api/ai-status')
        .then((res) => res.json())
        .then((data) => {
          setHasApiKey(Boolean(data.hasApiKey));
          setCheckedStatus(true);
        })
        .catch(() => {
          setHasApiKey(false);
          setCheckedStatus(true);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAsk = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResponseHtml(null);

    try {
      // Summary of dataset to pass
      const statsSummary = {
        totalRows: rows.length,
        columns: columns.map((c) => ({ name: c.name, type: c.type, unit: c.unit })),
        sampleCount: rows.length,
      };

      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          analysisType: 'Cố vấn Thống kê & Giáo dục Thể chất',
          statsData: statsSummary,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể kết nối với dịch vụ AI.');
      }

      setResponseHtml(data.text);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gửi yêu cầu tới AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Cố vấn Học tập AI – StatxAI</span>
                {hasApiKey ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Gemini AI Sẵn sàng
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Quy tắc thống kê nội bộ
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Hỏi đáp lý thuyết thống kê, diễn giải số liệu và khuyến nghị giáo án GDTC
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification */}
        <div className="py-3">
          {checkedStatus && !hasApiKey && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Thông báo tích hợp:</strong> Hiện tại hệ thống đang sử dụng{' '}
                <strong>bộ quy tắc giải thích toán thống kê được lập trình sẵn</strong> (không gửi dữ liệu cá nhân ra ngoài). Mọi phép tính mô tả, bảng ANOVA, trị số F, P-value và kiểm định Tukey HSD đều được tính toán nội bộ chính xác 100%. Khi người quản trị cung cấp GEMINI_API_KEY, tính năng phân tích nâng cao của mô hình AI sẽ được kích hoạt tự động.
              </div>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {/* Quick prompt suggestions */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 block">Câu hỏi gợi ý:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  handleAsk('Làm thế nào để chọn đúng giữa phép kiểm định t-test và ANOVA khi so sánh thể lực sinh viên?')
                }
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-left"
              >
                Khi nào dùng t-test vs ANOVA?
              </button>
              <button
                onClick={() =>
                  handleAsk('Nếu hệ số biến thiên CV% của lớp lớn hơn 20%, giáo viên GDTC nên phân chia bài tập thế nào?')
                }
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-left"
              >
                Xử lý sư phạm khi thể lực lớp phân hóa lớn (CV &gt; 20%)?
              </button>
              <button
                onClick={() =>
                  handleAsk('Tại sao P-value nhỏ hơn 0.05 không có nghĩa là chắc chắn có quan hệ nhân quả trong bài tập thể lực?')
                }
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-left"
              >
                Ý nghĩa P-value và quan hệ nhân quả?
              </button>
            </div>
          </div>

          {/* AI Response Output */}
          {loading && (
            <div className="p-6 text-center space-y-2">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
              <p className="text-slate-500">Đang tổng hợp nhận định thống kê sư phạm...</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
              {errorMsg}
            </div>
          )}

          {responseHtml && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 space-y-2 whitespace-pre-wrap leading-relaxed">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Nhận định từ Cố vấn StatxAI:</span>
              </div>
              <div className="text-xs text-slate-700">{responseHtml}</div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk();
            }}
            placeholder="Đặt câu hỏi về thống kê thể lực hoặc phương pháp tập luyện..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
