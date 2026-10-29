import React from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  Database,
  Dumbbell,
  FileSpreadsheet,
  GraduationCap,
  HeartPulse,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import { TabType } from './Navbar';

interface HomeViewProps {
  setActiveTab: (tab: TabType) => void;
  rowsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, rowsCount }) => {
  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-700/60 border border-blue-400/30 text-blue-100 text-xs sm:text-sm font-medium">
            <Activity className="w-4 h-4 text-blue-300" />
            <span>Khoa Giáo Dục Thể Chất & Khoa Học Thể Thao</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Stat<span className="text-blue-300">x</span>AI – Nền tảng Học Thống Kê Tương Tác
          </h1>

          <p className="text-base sm:text-lg text-blue-100 leading-relaxed font-normal">
            Công cụ phân tích toán thống kê chuyên sâu dành riêng cho sinh viên ngành Giáo dục thể chất. 
            Thực hành trực tiếp trên dữ liệu đo kiểm thể lực và hoạt động tập luyện thực tế do chính bạn thu thập — 
            từ thống kê mô tả, trực quan hóa biểu đồ đến kiểm định phân tích phương sai ANOVA một yếu tố.
          </p>

          {/* Principle note */}
          <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-400/20 text-xs sm:text-sm text-blue-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold">Nguyên tắc cốt lõi:</strong> Ứng dụng không sử dụng số liệu ảo hoặc mẫu có sẵn. Người học tự nhập hoặc tải tệp dữ liệu thực nghiệm của mình lên để bắt đầu phân tích toán học chính xác.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('data')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{rowsCount > 0 ? `Tiếp tục làm việc (${rowsCount} dòng)` : 'Bắt đầu nhập dữ liệu'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ôn tập Lý thuyết & Thi trắc nghiệm</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-700/50 hover:bg-blue-700/70 text-white font-semibold rounded-xl border border-blue-400/30 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem hướng dẫn học tập</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 top-10 opacity-10 pointer-events-none hidden lg:block">
          <Dumbbell className="w-72 h-72 text-white" />
        </div>
      </section>

      {/* Main Workflow (5 Steps) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quy trình nghiên cứu & xử lý số liệu</h2>
            <p className="text-sm text-slate-500">5 bước chuẩn mực trong nghiên cứu thực nghiệm giáo dục thể chất</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Step 1 */}
          <div
            onClick={() => setActiveTab('data')}
            className="group cursor-pointer bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Nhập dữ liệu</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tự thiết lập bảng, thêm cột, dán từ Excel hoặc tải tệp CSV với số lượng sinh viên tùy ý.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Đến bảng dữ liệu</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveTab('descriptive')}
            className="group cursor-pointer bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Thống kê mô tả</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tính trung bình, trung vị, độ lệch chuẩn, phương sai, sai số chuẩn và hệ số biến thiên (CV%).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Chạy mô tả</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveTab('charts')}
            className="group cursor-pointer bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-base mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Vẽ biểu đồ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Biểu đồ cột so sánh trung bình, phân tán (tương quan tuyến tính), histogram phân phối, biểu đồ hộp.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
              <span>Xem biểu đồ</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => setActiveTab('anova')}
            className="group cursor-pointer bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-base mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Phân tích ANOVA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kiểm định sai khác thể lực giữa 2 hoặc nhiều nhóm tập luyện, tính F, P-value và hậu nghiệm Tukey HSD.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
              <span>Kiểm định ANOVA</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 5 */}
          <div
            onClick={() => setActiveTab('guide')}
            className="group cursor-pointer bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Giải thích & Báo cáo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đọc kết luận sư phạm, đối chiếu giả thuyết H₀/H₁, kiểm tra giả định phân phối và xuất báo cáo CSV.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Đọc hướng dẫn</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Typical Physical Education Variables & Examples */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Các chỉ số thể lực & hoạt động tập luyện thường nghiên cứu
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Gợi ý các biến số thực nghiệm sinh viên có thể tự tổ chức thu thập số liệu trên sân bãi và phòng tập:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group 1 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2.5 text-blue-700 font-bold text-sm">
              <Scale className="w-5 h-5" />
              <span>Chỉ số hình thái & Nhân trắc</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Chiều cao đứng (cm):</strong> Thước đo nhân trắc cơ bản.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Cân nặng cơ thể (kg):</strong> Theo dõi khối lượng sinh viên.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Chỉ số khối cơ thể (BMI):</strong> Đánh giá mức độ phát triển thể chất.</span>
              </li>
            </ul>
          </div>

          {/* Group 2 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm">
              <Dumbbell className="w-5 h-5" />
              <span>Tố chất thể lực & Vận động</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Chống đẩy trong 1 phút (lần):</strong> Sức bền lực nhóm cơ tay - ngực.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bật xa tại chỗ (cm):</strong> Đánh giá sức mạnh bộc phát chi dưới.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Gập bụng 30 giây (lần):</strong> Sức bền cơ thân mình.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Chạy 100m (giây):</strong> Đánh giá tốc độ di chuyển cực đại.</span>
              </li>
            </ul>
          </div>

          {/* Group 3 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm">
              <HeartPulse className="w-5 h-5" />
              <span>Sinh lý & Hoạt động tập luyện</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Nhịp tim lúc nghỉ (lần/phút):</strong> Chỉ số thích nghi tim mạch.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Số buổi tập mỗi tuần:</strong> Đo lường tần suất rèn luyện thể chất.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Thời gian tập mỗi buổi (phút):</strong> Lượng vận động thể tích.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Nhóm thực nghiệm:</strong> Nhóm A (Cardio), B (HIIT), C (Đối chứng).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
