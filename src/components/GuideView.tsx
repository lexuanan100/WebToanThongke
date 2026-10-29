import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Database,
  Dumbbell,
  FileSpreadsheet,
  FileUp,
  GitCompare,
  HelpCircle,
  Lightbulb,
  Scale,
  Search,
  Sliders,
  TrendingUp
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  summary: string;
  icon: React.FC<{ className?: string }>;
  content: React.ReactNode;
}

export const GuideView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('sec1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sections: GuideSection[] = [
    {
      id: 'sec1',
      title: '1. Cách nhập & quản lý dữ liệu sinh viên',
      summary: 'Thao tác tạo bảng rỗng, thêm cột, thêm dòng và gõ trực tiếp số liệu thể lực',
      icon: Database,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Quy trình tạo và nhập bảng dữ liệu từ con số 0
          </h3>
          <p>
            Theo phương pháp học tích cực, StatxAI bắt đầu với một <strong>bảng dữ liệu hoàn toàn trống</strong> để người học tự tay tổ chức số liệu đo kiểm thể lực của mình.
          </p>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Các bước thực hiện trên giao diện:
            </h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Tạo cột biến mới:</strong> Bấm nút <code>"Thêm cột"</code>, đặt tên biến (ví dụ: <em>Chiều cao, Chống đẩy, Nhịp tim</em>), chọn loại biến là <em>Định lượng</em> (số đo) hoặc <em>Phân loại</em> (nhóm, giới tính), và nhập đơn vị đo.
              </li>
              <li>
                <strong>Sử dụng khung gợi ý nhanh:</strong> Nếu muốn tiết kiệm thời gian, bạn có thể nhấn nút <code>"Áp dụng khung 10 cột thể lực gợi ý"</code>. Thao tác này chỉ tạo sẵn tiêu đề 10 cột chuẩn trong GDTC mà <em>tuyệt đối không điền bất kỳ số liệu ảo nào</em>.
              </li>
              <li>
                <strong>Thêm dòng sinh viên:</strong> Bấm <code>"+1 dòng"</code>, <code>"+5 dòng"</code> hoặc <code>"+10 dòng"</code> để tạo số lượng sinh viên bạn mong muốn (5, 30, 50, 100 hay nhiều hơn). Không có giới hạn số dòng.
              </li>
              <li>
                <strong>Nhập trực tiếp số liệu:</strong> Nhấp chuột vào từng ô và gõ số liệu. Bạn có thể dùng dấu phẩy (<code>,</code>) hoặc dấu chấm (<code>.</code>) cho số thập phân (hệ thống tự chuẩn hóa).
              </li>
              <li>
                <strong>Chỉnh sửa & Xóa:</strong> Bấm vào biểu tượng cây bút để sửa tên cột/loại biến, hoặc biểu tượng thùng rác để xóa cột/dòng không cần thiết.
              </li>
            </ol>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Mẹo học tập:</strong> Bạn có thể sao lưu bảng dữ liệu về máy tính bất cứ lúc nào bằng nút <code>"Xuất CSV"</code>. Dữ liệu này mở được trực tiếp trong Microsoft Excel để lưu vào hồ sơ nghiên cứu.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec2',
      title: '2. Cách tải tệp CSV & dán từ Excel / Sheets',
      summary: 'Cách chuẩn bị tệp số liệu và nhập hàng loạt sinh viên trong 1 giây',
      icon: FileUp,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Nhập nhanh số lượng lớn sinh viên từ Excel hoặc Google Sheets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Cách 1: Sao chép & Dán trực tiếp</span>
              </div>
              <p className="text-xs text-slate-600">
                1. Mở tệp số liệu đo thể lực trong Microsoft Excel hoặc Google Sheets.<br />
                2. Bôi đen toàn bộ bảng gồm dòng tiêu đề và các dòng sinh viên.<br />
                3. Nhấn tổ hợp phím <strong>Ctrl+C</strong> (Windows) hoặc <strong>Cmd+C</strong> (Mac).<br />
                4. Trên StatxAI, bấm nút <strong>"Dán từ Excel"</strong>, nhấn <strong>Ctrl+V</strong> vào ô văn bản và bấm <strong>"Áp dụng"</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileUp className="w-4 h-4 text-blue-600" />
                <span>Cách 2: Tải lên tệp CSV</span>
              </div>
              <p className="text-xs text-slate-600">
                1. Trong Excel, chọn <em>File &gt; Save As &gt; CSV (Comma delimited) (*.csv)</em>.<br />
                2. Trên StatxAI, bấm nút <strong>"Tải tệp CSV"</strong> và chọn tệp vừa lưu.<br />
                3. Hệ thống tự nhận diện bộ mã tiếng Việt UTF-8, dấu phân cách và tự động phân loại cột số / cột chữ.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Lưu ý định dạng:</strong> Đảm bảo dòng đầu tiên của bảng tính là tên các cột (ví dụ: Mã SV, Chiều cao, Chống đẩy). Tránh để các dòng trống ở đầu bảng tính.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec3',
      title: '3. Phân biệt Biến định lượng & Biến phân loại',
      summary: 'Nguyên lý chọn đúng loại biến trong nghiên cứu Giáo dục Thể chất',
      icon: Sliders,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Hiểu đúng bản chất của các loại biến số
          </h3>
          <p>
            Trong thống kê thể thao, việc xác định sai loại biến sẽ dẫn đến áp dụng sai thuật toán (ví dụ: không thể tính trung bình của Giới tính hoặc Nhóm tập).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="font-bold text-blue-950 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Biến định lượng (Quantitative / Numeric)</span>
              </div>
              <p className="text-xs text-slate-600">
                Là các chỉ số đo lường bằng con số thực tế có ý nghĩa toán học (cộng, trừ, tính trung bình được):
              </p>
              <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                <li>Chiều cao (cm), Cân nặng (kg).</li>
                <li>Số lần chống đẩy trong 1 phút (lần).</li>
                <li>Thời gian chạy cự ly 100m hoặc 1500m (giây/phút).</li>
                <li>Nhịp tim lúc nghỉ (lần/phút - bpm).</li>
                <li>Chỉ số công năng tim Harvard, Cooper 12 phút (m).</li>
              </ul>
              <p className="text-xs font-semibold text-blue-800">
                =&gt; Sử dụng trong: Thống kê mô tả (Mean, SD, CV), Biến phụ thuộc ANOVA, Trục biểu đồ phân tán.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="font-bold text-amber-950 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>Biến phân loại (Categorical / Qualitative)</span>
              </div>
              <p className="text-xs text-slate-600">
                Là các thuộc tính dùng để phân nhóm, xếp loại hoặc nhận dạng đối tượng:
              </p>
              <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                <li>Giới tính (Nam, Nữ).</li>
                <li>Nhóm thực nghiệm tập luyện (Nhóm HIIT, Nhóm Cardio, Nhóm Đối chứng).</li>
                <li>Lớp học / Khóa học (K46 GDTC, K47 GDTC).</li>
                <li>Xếp loại thể lực (Giỏi, Khá, Đạt, Chưa đạt).</li>
              </ul>
              <p className="text-xs font-semibold text-amber-800">
                =&gt; Sử dụng trong: Biến phân nhóm (Factor) trong ANOVA, Biểu đồ tần số phân loại.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec4',
      title: '4. Cách chạy & đọc Thống kê mô tả',
      summary: 'Công thức toán học và giải thích ý nghĩa sư phạm các tham số',
      icon: Calculator,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Giải nghĩa các chỉ số thống kê mô tả mẫu trong GDTC
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-2.5 border-b border-slate-200">Chỉ số</th>
                  <th className="p-2.5 border-b border-slate-200">Công thức toán</th>
                  <th className="p-2.5 border-b border-slate-200">Ý nghĩa thực tiễn Giáo dục Thể chất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2.5 font-bold text-blue-700">Trung bình mẫu (X̄)</td>
                  <td className="p-2.5 font-mono text-slate-600">Σ xᵢ / n</td>
                  <td className="p-2.5">Trình độ thể lực đại diện chung của cả lớp/nhóm.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Trung vị (Median)</td>
                  <td className="p-2.5 font-mono text-slate-600">Điểm phân vị 50%</td>
                  <td className="p-2.5">Giá trị ở vị trí chính giữa khi sắp xếp tăng dần; không bị ảnh hưởng bởi vận động viên quá xuất sắc hoặc sinh viên cá biệt.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Mốt (Mode)</td>
                  <td className="p-2.5 font-mono text-slate-600">Tần số lớn nhất</td>
                  <td className="p-2.5">Mức thành tích có nhiều sinh viên đạt được nhất.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-indigo-700">Độ lệch chuẩn mẫu (s)</td>
                  <td className="p-2.5 font-mono text-slate-600">√[Σ(xᵢ - X̄)² / (n - 1)]</td>
                  <td className="p-2.5">Độ phân tán thể lực xung quanh mức trung bình. s nhỏ =&gt; thể lực lớp đồng đều; s lớn =&gt; chênh lệch lớn giữa sinh viên.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-700">Hệ số biến thiên CV%</td>
                  <td className="p-2.5 font-mono text-slate-600">(s / |X̄|) × 100%</td>
                  <td className="p-2.5">Tiêu chuẩn quốc tế đánh giá độ đồng nhất: CV &lt; 10% (rất đồng đều), 10 - 20% (trung bình), &gt; 20% (phân hóa cao).</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Sai số chuẩn (SE)</td>
                  <td className="p-2.5 font-mono text-slate-600">s / √n</td>
                  <td className="p-2.5">Đo độ chính xác của số trung bình mẫu khi suy rộng ra toàn thể sinh viên trường.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'sec5',
      title: '5. Cách chọn biểu đồ trực quan hóa dữ liệu',
      summary: 'Quy tắc vàng chọn loại biểu đồ phù hợp với mục tiêu phân tích',
      icon: BarChart3,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Lựa chọn biểu đồ phù hợp với cấu trúc dữ liệu
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 text-xs sm:text-sm">Biểu đồ Cột (Bar Chart):</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  • <em>So sánh trung bình:</em> Khi muốn so sánh mức độ thể lực (ví dụ: Chống đẩy trung bình) giữa các nhóm sinh viên (Nhóm A, Nhóm B, Nhóm C), có hiển thị kèm thanh sai số ±1 SD.<br />
                  • <em>Tần số:</em> Thể hiện số lượng sinh viên phân bố theo từng phân loại (ví dụ: tỉ lệ Nam/Nữ).
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 text-xs sm:text-sm">Biểu đồ Phân tán (Scatter Plot):</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Dùng khi kiểm tra <strong>mối liên hệ tương quan</strong> giữa 2 biến định lượng (ví dụ: Chiều cao với Bật xa, hoặc Số buổi tập/tuần với Nhịp tim lúc nghỉ). Hệ thống tự động tính hệ số tương quan Pearson <em>r</em> và vẽ đường xu hướng hồi quy tuyến tính.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 text-xs sm:text-sm">Biểu đồ Histogram & Biểu đồ Hộp (Box Plot):</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  • <em>Histogram:</em> Xem hình dạng phân bố tần số thể lực của sinh viên có đối xứng (hình chuông chuẩn) hay bị lệch.<br />
                  • <em>Biểu đồ hộp (Box Plot):</em> Quan sát trực quan 5 số đặc trưng (Min, Q1, Median, Q3, Max) và phát hiện các điểm ngoại lai (Outliers) có thể do đo sai số.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec6',
      title: "6. Chuyên sâu: Kiểm định t (t-test) & Cỡ ảnh hưởng (Cohen's d)",
      summary: "3 loại t-test, giả định Shapiro-Wilk & Levene, diễn giải P-value và tính cỡ ảnh hưởng Cohen's d với công thức toán chuẩn",
      icon: GitCompare,
      content: (
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 6.1 */}
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Phần 1: Khái niệm & 3 Loại Kiểm định t
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Bản chất kiểm định t trong nghiên cứu Giáo dục Thể chất
            </h3>
            <p className="mb-3">
              Kiểm định t (Student's t-test) là phương pháp tham số dùng để so sánh <strong>giá trị trung bình</strong> giữa 1 hoặc 2 nhóm dữ liệu. Trong thể dục thể thao, kiểm định t được chia thành 3 dạng chính:
            </p>

            <div className="space-y-4">
              {/* Type 1: One-Sample */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    A. Kiểm định t một mẫu (One-Sample t-test)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                    df = n - 1
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Dùng khi so sánh điểm trung bình của một nhóm sinh viên với một chuẩn thể lực quốc gia cố định (μ₀).
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-center text-xs text-blue-900">
                  t = (X̄ - μ₀) / (s / √n) = (X̄ - μ₀) / SE
                </div>
                <p className="text-[11px] text-slate-500">
                  * Trong đó: X̄ là trung bình mẫu, s là độ lệch chuẩn mẫu, n là số sinh viên, SE = s / √n là sai số chuẩn.
                </p>
              </div>

              {/* Type 2: Independent */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    B. Kiểm định t hai mẫu độc lập (Independent Samples t-test)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                    Student & Welch
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  So sánh 2 nhóm sinh viên hoàn toàn tách biệt (ví dụ: Nhóm thực nghiệm HIIT vs Nhóm đối chứng Cardio).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-sans">
                      1. Student's t-test (Phương sai bằng nhau: σ₁² = σ₂²):
                    </strong>
                    <div className="p-1.5 bg-slate-50 rounded text-center font-mono text-[11px] text-slate-800">
                      s_p² = [(n₁ - 1)s₁² + (n₂ - 1)s₂²] / (n₁ + n₂ - 2)
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded text-center font-mono text-[11px] text-blue-700 font-bold">
                      t = (X̄₁ - X̄₂) / √[s_p² (1/n₁ + 1/n₂)]
                    </div>
                    <span className="text-[10px] text-slate-400 block">Bậc tự do: df = n₁ + n₂ - 2</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-sans">
                      2. Welch's t-test (Phương sai không đồng nhất: σ₁² ≠ σ₂²):
                    </strong>
                    <div className="p-1.5 bg-slate-50 rounded text-center font-mono text-[11px] text-slate-800">
                      SE_Welch = √(s₁²/n₁ + s₂²/n₂)
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded text-center font-mono text-[11px] text-blue-700 font-bold">
                      t = (X̄₁ - X̄₂) / SE_Welch
                    </div>
                    <span className="text-[10px] text-slate-400 block">Bậc tự do Welch-Satterthwaite (df hiệu chỉnh lẻ)</span>
                  </div>
                </div>
              </div>

              {/* Type 3: Paired */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    C. Kiểm định t theo cặp (Paired Samples t-test)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    df = n - 1 (n số cặp)
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Đo trên cùng một nhóm sinh viên ở 2 thời điểm (Trước can thiệp X₁ và Sau can thiệp X₂). Phân tích trên chuỗi chênh lệch: Dᵢ = X₂ᵢ - X₁ᵢ.
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-center text-xs text-emerald-800 font-bold">
                  t = (D̄ - 0) / (s_D / √n)
                </div>
                <p className="text-[11px] text-slate-500">
                  * Trong đó: D̄ = (Σ Dᵢ) / n là mức chênh lệch trung bình, s_D là độ lệch chuẩn của chuỗi hiệu số.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6.2: Assumptions & Testing */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Phần 2: Giả định thống kê & Phương pháp kiểm tra
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Kiểm tra giả định phân phối chuẩn (Shapiro-Wilk) & Đồng nhất phương sai (Levene)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shapiro-Wilk */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>1. Kiểm định phân phối chuẩn: Shapiro-Wilk</span>
                </div>
                <p className="text-xs text-slate-600">
                  Kiểm định xem dữ liệu thể lực của sinh viên có phân bố xấp xỉ hình chuông Gauss đối xứng hay không (đặc biệt nhạy với mẫu nhỏ n &lt; 50).
                </p>
                <div className="p-2 bg-slate-50 rounded text-xs space-y-1 font-mono text-slate-800">
                  <div>• H₀: Dữ liệu tuân theo phân phối chuẩn.</div>
                  <div>• H₁: Dữ liệu KHÔNG tuân theo phân phối chuẩn.</div>
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-emerald-800">
                    ✓ Nếu p ≥ 0.05: Thỏa mãn giả định chuẩn ➔ Dùng t-test tham số.
                  </div>
                  <div className="font-semibold text-rose-800">
                    ✗ Nếu p &lt; 0.05: Bác bỏ H₀ (phân phối lệch) ➔ Dùng kiểm định phi tham số: <strong>Mann-Whitney U</strong> (cho 2 mẫu độc lập) hoặc <strong>Wilcoxon Signed-Rank</strong> (cho mẫu theo cặp).
                  </div>
                </div>
              </div>

              {/* Levene's Test */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <span>2. Kiểm định đồng nhất phương sai: Levene's Test</span>
                </div>
                <p className="text-xs text-slate-600">
                  Kiểm tra xem độ phân tán thể lực giữa 2 nhóm sinh viên có tương đồng nhau không (chỉ áp dụng cho Independent t-test).
                </p>
                <div className="p-2 bg-slate-50 rounded text-xs space-y-1 font-mono text-slate-800">
                  <div>• H₀: Phương sai 2 nhóm bằng nhau (σ₁² = σ₂²).</div>
                  <div>• H₁: Phương sai 2 nhóm khác nhau (σ₁² ≠ σ₂²).</div>
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-emerald-800">
                    ✓ Nếu p ≥ 0.05: Phương sai đồng nhất ➔ Dùng <strong>Student's t-test</strong> (Equal variances assumed).
                  </div>
                  <div className="font-semibold text-amber-800">
                    ! Nếu p &lt; 0.05: Phương sai dị biệt ➔ Dùng ngay <strong>Welch's t-test</strong> (Equal variances not assumed).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6.3: Interpreting P-value & Cohen's d */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Phần 3: Diễn giải P-value & Cỡ ảnh hưởng (Cohen's d)
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Quy tắc đối chiếu P-value và tính toán mức độ hiệu quả thực tế
            </h3>

            {/* P-value rule */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs">Diễn giải P-value với mức ý nghĩa α = 0.05:</span>
              <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-700">
                <li>
                  <strong>Nếu P &lt; 0.05 (hoặc P &lt; α):</strong> Bác bỏ H₀. Có sự khác biệt có ý nghĩa thống kê giữa hai giá trị trung bình.
                </li>
                <li>
                  <strong>Nếu P ≥ 0.05:</strong> Chưa đủ bằng chứng bác bỏ H₀. Không thể kết luận hai phương pháp tập luyện tạo ra kết quả khác nhau.
                </li>
                <li className="text-amber-800 font-semibold">
                  * Lưu ý phương pháp luận: P-value chỉ cho biết sự chênh lệch có phải do ngẫu nhiên hay không, KHÔNG cho biết mức độ chênh lệch lớn hay nhỏ trong thực tiễn! Để biết độ lớn hiệu quả, bắt buộc phải tính Cỡ ảnh hưởng (Cohen's d).
                </li>
              </ul>
            </div>

            {/* Cohen's d Formula and Interpretation */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 text-xs sm:text-sm">
                  Công thức tính Cỡ ảnh hưởng Cohen's d (Standardized Mean Difference)
                </span>
                <span className="text-[11px] font-mono text-blue-700 font-bold">Standard Metric</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                  <span className="font-bold text-slate-800 text-xs">Cho hai mẫu độc lập:</span>
                  <div className="p-2 bg-slate-50 rounded text-center font-mono text-xs text-blue-800 font-bold">
                    d = (X̄₁ - X̄₂) / s_p
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Trong đó s_p = √[((n₁-1)s₁² + (n₂-1)s₂²) / (n₁+n₂-2)] là độ lệch chuẩn gộp.
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                  <span className="font-bold text-slate-800 text-xs">Cho mẫu theo cặp (Trước - Sau):</span>
                  <div className="p-2 bg-slate-50 rounded text-center font-mono text-xs text-emerald-800 font-bold">
                    d = D̄ / s_D
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Trong đó D̄ là trung bình độ chênh lệch, s_D là độ lệch chuẩn hiệu số.
                  </span>
                </div>
              </div>

              {/* Cohen's benchmark table */}
              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-800 text-xs">Bảng quy chuẩn đánh giá độ lớn hiệu ứng thể lực theo Jacob Cohen (1988):</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white border border-blue-100 rounded-lg overflow-hidden">
                    <thead className="bg-blue-100/60 text-blue-950 font-bold">
                      <tr>
                        <th className="p-2">Giá trị |d|</th>
                        <th className="p-2">Phân loại cỡ ảnh hưởng</th>
                        <th className="p-2">Ý nghĩa trong Huấn luyện & Giáo dục Thể chất</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50 text-slate-700">
                      <tr>
                        <td className="p-2 font-mono font-bold text-slate-600">|d| &lt; 0.2</td>
                        <td className="p-2 text-slate-500">Rất nhỏ (Negligible)</td>
                        <td className="p-2">Sự chênh lệch không đáng kể trong thực tế huấn luyện.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-blue-600">0.2 ≤ |d| &lt; 0.5</td>
                        <td className="p-2 font-medium">Nhỏ (Small)</td>
                        <td className="p-2">Có sự tiến bộ nhẹ, cần theo dõi thêm thời gian dài hơn.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-indigo-600">0.5 ≤ |d| &lt; 0.8</td>
                        <td className="p-2 font-semibold">Trung bình (Medium)</td>
                        <td className="p-2">Hiệu quả rõ rệt, giáo viên có thể nhận thấy bằng mắt thường.</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="p-2 font-mono font-bold text-emerald-700">|d| ≥ 0.8</td>
                        <td className="p-2 font-bold text-emerald-800">Lớn (Large)</td>
                        <td className="p-2">Bước nhảy vọt về tố chất thể lực (chống đẩy, bật xa, sức bền). Khẳng định tính ưu việt của bài tập.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec7',
      title: '7. Quy trình kiểm định ANOVA một yếu tố',
      summary: 'Bản chất phân tích phương sai khi so sánh từ 3 nhóm sinh viên trở lên',
      icon: Activity,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Mục đích và cơ chế hoạt động của One-Way ANOVA
          </h3>
          <p>
            Trong Giáo dục thể chất, giảng viên thường muốn so sánh hiệu quả của các phương pháp tập luyện khác nhau trên sinh viên (ví dụ: Nhóm 1 tập bài tập Cardio truyền thống, Nhóm 2 tập HIIT, Nhóm 3 không can thiệp).
          </p>
          <p>
            Thay vì làm nhiều phép so sánh cặp t-test rời rạc (làm tăng nguy cơ sai lầm loại I tích lũy), <strong>ANOVA một yếu tố</strong> kiểm định đồng thời toàn bộ các nhóm với câu hỏi: <em>"Liệu phương pháp tập luyện có tạo ra sự khác biệt thực sự về thể lực giữa các nhóm hay không?"</em>
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Cặp giả thuyết thống kê:</h4>
            <p className="text-xs font-mono text-slate-800">
              • H₀: μ₁ = μ₂ = ... = μₖ (Trung bình thể lực của tất cả các nhóm là như nhau)
            </p>
            <p className="text-xs font-mono text-slate-800">
              • H₁: Tồn tại ít nhất một cặp nhóm có trung bình thể lực khác nhau (μᵢ ≠ μⱼ)
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
            <strong>Bản chất của F-statistic:</strong> F = (Biến thiên giữa các nhóm do phương pháp tập) / (Biến thiên ngẫu nhiên nội bộ sinh viên trong nhóm). F càng lớn vượt xa F_crit thì bằng chứng về sự khác biệt càng thuyết phục.
          </div>
        </div>
      ),
    },
    {
      id: 'sec8',
      title: '8. Cách đọc bảng kết quả ANOVA & P-value',
      summary: 'Quy tắc ra quyết định khoa học và giải thích hậu nghiệm Tukey HSD',
      icon: CheckCircle2,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Quy tắc đọc bảng ANOVA chuẩn mực
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="font-bold text-emerald-900 text-sm">
                Trường hợp 1: P-value &lt; α (Ví dụ P &lt; 0.05)
              </div>
              <p className="text-xs text-emerald-950">
                • <strong>Quyết định:</strong> Bác bỏ giả thuyết không H₀.<br />
                • <strong>Kết luận:</strong> Có sự khác biệt có ý nghĩa thống kê giữa các nhóm sinh viên về chỉ số thể lực đang nghiên cứu.<br />
                • <strong>Bước tiếp theo:</strong> Tra cứu bảng <em>Kiểm định hậu nghiệm Tukey HSD</em> bên dưới để biết chính xác nhóm nào vượt trội hơn nhóm nào.
              </p>
            </div>

            <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-xl space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">
                Trường hợp 2: P-value ≥ α (Ví dụ P ≥ 0.05)
              </div>
              <p className="text-xs text-slate-700">
                • <strong>Quyết định:</strong> Chưa đủ bằng chứng thống kê để bác bỏ H₀.<br />
                • <strong>Kết luận:</strong> Chưa thể khẳng định có sự khác biệt giữa các phương pháp tập luyện. Sự chênh lệch nhỏ về điểm số nếu có chỉ là do biến động ngẫu nhiên của mẫu chọn.<br />
                • <strong>Không thực hiện:</strong> Không diễn giải phân tích sâu từng cặp nếu ANOVA tổng thể không có ý nghĩa.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec9',
      title: '9. Các lỗi thường gặp & Cách xử lý',
      summary: 'Xử lý dữ liệu thiếu, định dạng sai, và các cảnh báo vi phạm điều kiện trong nghiên cứu GDTC',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Khắc phục các sự cố thường gặp khi xử lý số liệu thể lực
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-rose-700 text-xs">Lỗi: "Không có biến định lượng để chạy thống kê"</span>
              <p className="text-xs text-slate-600">
                <strong>Nguyên nhân:</strong> Các cột số liệu bạn tạo đang bị để ở chế độ "Phân loại", hoặc dữ liệu bị dính các ký tự chữ (ví dụ gõ "65kg" thay vì chỉ gõ số "65").<br />
                <strong>Khắc phục:</strong> Bấm vào biểu tượng cây bút ở đầu cột trong tab Nhập dữ liệu và chuyển loại biến sang "Biến định lượng", đồng thời nhập đơn vị vào ô đơn vị riêng.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-rose-700 text-xs">Lỗi: "ANOVA hoặc t-test yêu cầu ít nhất 2 nhóm có dữ liệu"</span>
              <p className="text-xs text-slate-600">
                <strong>Nguyên nhân:</strong> Cột phân nhóm chỉ có 1 tên nhóm duy nhất (ví dụ tất cả đều là "Lớp 1"), hoặc số sinh viên trong nhóm nhỏ hơn 2.<br />
                <strong>Khắc phục:</strong> Thêm sinh viên thuộc nhóm đối chiếu thứ 2 (ví dụ "Lớp 2" hoặc "Nhóm B") với tối thiểu 2 sinh viên trong mỗi nhóm.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-rose-700 text-xs">Lỗi hiển thị tiếng Việt bị lỗi font khi mở file trong Excel</span>
              <p className="text-xs text-slate-600">
                <strong>Khắc phục:</strong> Tính năng "Xuất CSV" của StatxAI đã được tích hợp sẵn mã UTF-8 BOM chuẩn quốc tế, giúp Microsoft Excel tự động nhận diện dấu tiếng Việt có dấu hoàn hảo mà không bị biến thành ký tự lạ.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Cẩm nang Hướng dẫn Học tập Thống kê Thể chất</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tài liệu sư phạm 9 chương chuyên sâu dành riêng cho sinh viên ngành Giáo dục Thể chất và Khoa học Thể thao.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm hướng dẫn..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Layout: Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {filteredSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 group ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {sec.title}
                  </h4>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {sec.summary}
                  </p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white translate-x-1' : 'text-slate-300 group-hover:text-slate-500'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Detailed Content Viewer */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="pb-4 mb-6 border-b border-slate-100">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Chương mục chi tiết
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">{activeSection.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{activeSection.summary}</p>
          </div>

          <div>{activeSection.content}</div>
        </div>
      </div>
    </div>
  );
};
