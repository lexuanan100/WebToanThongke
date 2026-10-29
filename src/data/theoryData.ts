export interface TheoryTopic {
  id: string;
  topicNumber: number;
  title: string;
  subtitle: string;
  category: string;
  concepts: string[];
  formulaList?: { name: string; formula: string; note: string }[];
  calculationSteps: string[];
  sportExample: {
    title: string;
    description: string;
    data: string;
    solutionSteps: { step: string; content: string }[];
    conclusion: string;
  };
  pitfallsAndNotes: string[];
}

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'topic-1',
    topicNumber: 1,
    title: 'Những khái niệm cơ bản & Thang đo trong TDTT',
    subtitle: 'Tổng thể, Mẫu, Biến số và 4 thang đo Stevens trong nghiên cứu Thể dục Thể thao',
    category: 'Cơ sở nền tảng',
    concepts: [
      'Tổng thể (Population - N): Toàn bộ tập hợp các đối tượng nghiên cứu (VD: Toàn bộ sinh viên nam năm thứ nhất Trường ĐH Sư phạm TDTT).',
      'Mẫu (Sample - n): Tập hợp con được rút ra ngẫu nhiên hoặc có chủ đích từ tổng thể để đo đạc và suy rộng (VD: 60 sinh viên được chọn ngẫu nhiên).',
      'Biến số (Variable): Đại lượng hoặc đặc tính thay đổi giữa các cá thể (chiều cao, thành tích chạy 100m, nhịp tim, giới tính).',
      'Thang đo Định danh (Nominal scale): Phân loại định tính, không có thứ tự hơn kém (VD: Giới tính [Nam=1, Nữ=2], Nhóm tập [A, B], Bộ môn [Điền kinh, Bóng chuyền]).',
      'Thang đo Thứ bậc (Ordinal scale): Có thứ tự hơn kém nhưng khoảng cách giữa các bậc không bằng nhau (VD: Cấp bậc VĐV [Cấp III, Cấp II, Cấp I, Kiện tướng], Xếp loại thể lực [Kém, Trung bình, Khá, Tốt]).',
      'Thang đo Khoảng (Interval scale): Khoảng cách giữa các giá trị đều nhau, nhưng điểm 0 chỉ là quy ước, không biểu thị sự vắng mặt tuyệt đối (VD: Nhiệt độ Celsius °C, Điểm số T-score).',
      'Thang đo Tỷ lệ (Ratio scale): Đầy đủ tính chất khoảng cách đều nhau VÀ có điểm 0 tuyệt đối (VD: Thời gian chạy 100m [giây], Cân nặng [kg], Chiều cao bật xa [cm], Nhịp tim [lần/phút]). Phép nhân chia có ý nghĩa vật lý (chạy 10s nhanh gấp đôi 20s).'
    ],
    formulaList: [
      {
        name: 'Kích thước mẫu tối thiểu (Ước lượng trung bình)',
        formula: 'n = \\frac{Z_{\\alpha/2}^2 \\cdot \\sigma^2}{\\Delta^2}',
        note: 'Trong đó Z là phân vị chuẩn, sigma là độ lệch chuẩn dự kiến, Delta là sai số biên cho phép.'
      }
    ],
    calculationSteps: [
      'Bước 1: Xác định rõ câu hỏi nghiên cứu và đối tượng tổng thể N.',
      'Bước 2: Phân loại đúng thang đo của từng biến số (Định danh, Thứ bậc, Khoảng, Tỷ lệ) để chọn thuật toán thống kê phù hợp.',
      'Bước 3: Chọn phương pháp lấy mẫu khách quan (ngẫu nhiên đơn, ngẫu nhiên phân tầng theo giới tính/khoa).',
      'Bước 4: Kiểm tra tính đại diện và cỡ mẫu n trước khi tiến hành xử lý số liệu.'
    ],
    sportExample: {
      title: 'Xác định thang đo trong phiếu kiểm tra thể lực sinh viên GDTC',
      description: 'Một giảng viên thể dục ghi nhận các thông tin sau của 40 sinh viên: (1) Mã SV, (2) Giới tính, (3) Xếp loại thể lực (Yếu, Đạt, Giỏi), (4) Chiều cao (cm), (5) Thời gian chạy 1500m (phút:giây).',
      data: 'Thông tin 5 biến thu thập.',
      solutionSteps: [
        {
          step: 'Phân tích biến (1) và (2)',
          content: 'Mã SV và Giới tính là thang đo ĐỊNH DANH (Nominal), chỉ dùng để định danh hoặc phân nhóm, không tính trung bình cộng có ý nghĩa.'
        },
        {
          step: 'Phân tích biến (3)',
          content: 'Xếp loại thể lực (Yếu, Đạt, Giỏi) là thang đo THỨ BẬC (Ordinal). Có thứ tự Giỏi > Đạt > Yếu nhưng khoảng cách thể lực giữa Yếu lên Đạt không nhất thiết bằng từ Đạt lên Giỏi.'
        },
        {
          step: 'Phân tích biến (4) và (5)',
          content: 'Chiều cao (cm) và Thời gian chạy (giây) là thang đo TỶ LỆ (Ratio) vì có số 0 tuyệt đối (0 cm, 0 giây) và tính được các tỷ số toán học có ý nghĩa vật lý.'
        }
      ],
      conclusion: 'Giảng viên chỉ được tính Trung bình cộng và Độ lệch chuẩn trên biến (4) và (5); đối với biến (1) và (2) dùng Tần số - Tỷ lệ phần trăm; đối với biến (3) dùng Trung vị hoặc Tần số tích lũy.'
    },
    pitfallsAndNotes: [
      'Không được lấy trung bình cộng của số mã hóa biến định danh (ví dụ mã hóa Nam=1, Nữ=2 thì trung bình 1.5 không mang ý nghĩa "giới tính trung bình").',
      'Với biến thứ bậc (Xếp loại), việc tính số trung bình cộng cần thận trọng; nên ưu tiên dùng Trung vị (Median) và Tần số phần trăm.'
    ]
  },
  {
    id: 'topic-2',
    topicNumber: 2,
    title: 'Thống kê mô tả & Các tham số đặc trưng trong TDTT',
    subtitle: 'Số trung bình (X̄), Trung vị (Med), Mốt (Mod), Phương sai (S²), Độ lệch chuẩn (S), Hệ số biến thiên (Cv)',
    category: 'Mô tả số liệu',
    concepts: [
      'Số trung bình cộng (Mean - X̄): Giá trị đại diện cho mức độ trung bình của mẫu thành tích.',
      'Trung vị (Median - Med): Giá trị chia đôi phân phối mẫu khi đã sắp xếp theo thứ tự, không bị ảnh hưởng bởi thành tích đột biến (outliers).',
      'Mốt (Mode - Mod): Giá trị xuất hiện với tần số lớn nhất trong mẫu.',
      'Khoảng biến thiên (Range - R): Hiệu số giữa thành tích cao nhất và thấp nhất: R = Xmax - Xmin.',
      'Phương sai mẫu (Sample Variance - S²): Trung bình bình phương độ lệch của các giá trị so với số trung bình.',
      'Độ lệch chuẩn (Standard Deviation - S): Căn bậc hai của phương sai, cùng đơn vị đo với biến số, phản ánh độ phân tán của thành tích thể lực.',
      'Hệ số biến thiên (Coefficient of Variation - Cv): Tỷ lệ giữa độ lệch chuẩn và số trung bình tính theo %, dùng so sánh độ phân tán giữa các nội dung thể thao có đơn vị đo khác nhau (bật xa cm vs chạy giây).'
    ],
    formulaList: [
      {
        name: 'Số trung bình mẫu',
        formula: '\\bar{X} = \\frac{\\sum_{i=1}^{n} X_i}{n}',
        note: 'Trong đó n là số lượng sinh viên được đo.'
      },
      {
        name: 'Phương sai mẫu hiệu chỉnh',
        formula: 'S^2 = \\frac{\\sum_{i=1}^{n} (X_i - \\bar{X})^2}{n - 1}',
        note: 'Chia cho (n - 1) để ước lượng không chệch cho phương sai tổng thể.'
      },
      {
        name: 'Độ lệch chuẩn mẫu',
        formula: 'S = \\sqrt{S^2} = \\sqrt{\\frac{\\sum (X_i - \\bar{X})^2}{n - 1}}',
        note: 'Cùng đơn vị với số đo gốc (cm, kg, giây, lần).'
      },
      {
        name: 'Hệ số biến thiên Cv (%)',
        formula: 'Cv = \\frac{S}{\\bar{X}} \\times 100\\%',
        note: 'Quy chuẩn TDTT: Cv < 10%: Mẫu rất đồng đều; 10% <= Cv <= 20%: Đồng đều trung bình; Cv > 20%: Mẫu phân tán mạnh, không đồng đều.'
      }
    ],
    calculationSteps: [
      'Bước 1: Tính tổng các thành tích: \\sum X_i và tính số trung bình \\bar{X} = \\sum X_i / n.',
      'Bước 2: Lập bảng hiệu số độ lệch (X_i - \\bar{X}) và bình phương độ lệch (X_i - \\bar{X})^2.',
      'Bước 3: Tính tổng bình phương độ lệch SS = \\sum (X_i - \\bar{X})^2.',
      'Bước 4: Chia cho bậc tự do (n - 1) để nhận được phương sai S^2.',
      'Bước 5: Lấy căn bậc hai tính S, sau đó lấy (S / \\bar{X}) * 100% để tính Cv.'
    ],
    sportExample: {
      title: 'Tính toán tham số thể lực bật xa tại chỗ (cm) của 5 sinh viên nam',
      description: 'Số liệu đo thành tích bật xa tại chỗ của 5 sinh viên: 210, 220, 215, 225, 230 (cm).',
      data: 'n = 5 sinh viên. Giá trị X = [210, 215, 220, 225, 230].',
      solutionSteps: [
        {
          step: '1. Tính số trung bình X̄',
          content: 'Tổng = 210 + 220 + 215 + 225 + 230 = 1100 cm. X̄ = 1100 / 5 = 220.0 cm.'
        },
        {
          step: '2. Tính Trung vị và Khoảng biến thiên',
          content: 'Dãy sắp xếp: 210, 215, 220, 225, 230. Giá trị chính giữa Med = 220.0 cm. R = 230 - 210 = 20 cm.'
        },
        {
          step: '3. Tính bình phương sai lệch SS',
          content: '(210-220)² + (215-220)² + (220-220)² + (225-220)² + (230-220)² = 100 + 25 + 0 + 25 + 100 = 250.'
        },
        {
          step: '4. Phương sai S² và Độ lệch chuẩn S',
          content: 'S² = 250 / (5 - 1) = 250 / 4 = 62.5 cm². S = √62.5 ≈ 7.91 cm.'
        },
        {
          step: '5. Hệ số biến thiên Cv (%)',
          content: 'Cv = (7.91 / 220.0) * 100% ≈ 3.59%.'
        }
      ],
      conclusion: 'Thành tích bật xa trung bình là 220.0 ± 7.91 cm. Hệ số biến thiên Cv = 3.59% < 10% chứng tỏ nhóm sinh viên này có trình độ thể lực sức bật rất đồng đều.'
    },
    pitfallsAndNotes: [
      'Lỗi sinh viên hay mắc: Chia cho n thay vì (n - 1) khi tính phương sai mẫu.',
      'Khi thành tích có giá trị dị biệt cực lớn (VD: một SV chuyên nghiệp bật xa 290cm), trung bình cộng sẽ bị kéo lệch, lúc này Median phản ánh trung thực hơn Mean.'
    ]
  },
  {
    id: 'topic-3',
    topicNumber: 3,
    title: 'Phân phối chuẩn, Quy tắc 68-95-99.7 & Điểm Z, Điểm T',
    subtitle: 'Ứng dụng quy luật Gauss để chuẩn hóa điểm số, xếp loại và xây dựng thang điểm TDTT',
    category: 'Phân phối xác suất',
    concepts: [
      'Phân phối chuẩn Gauss: Đường cong hình chuông đối xứng hoàn hảo qua số trung bình (X̄ = Med = Mod). Đa số chỉ số nhân trắc và thể lực (chiều cao, sức bật, dung tích sống) của quần thể đồng nhất đều tuân theo phân phối chuẩn.',
      'Quy tắc thực nghiệm 68 - 95 - 99.7%:',
      '• Khoảng [X̄ - 1S; X̄ + 1S] chứa xấp xỉ 68.26% số sinh viên.',
      '• Khoảng [X̄ - 2S; X̄ + 2S] chứa xấp xỉ 95.44% số sinh viên.',
      '• Khoảng [X̄ - 3S; X̄ + 3S] chứa xấp xỉ 99.74% số sinh viên.',
      'Điểm tiêu chuẩn Z (Z-score): Cho biết một thành tích cách giá trị trung bình bao nhiêu độ lệch chuẩn: Z = (X - X̄) / S. Z có trung bình bằng 0, độ lệch chuẩn bằng 1.',
      'Điểm tiêu chuẩn T (T-score): Chuyển đổi từ điểm Z để loại bỏ dấu âm và số thập phân: T = 50 + 10Z. T có trung bình 50, độ lệch chuẩn 10. Rất phổ biến trong xếp loại thể lực học đường.'
    ],
    formulaList: [
      {
        name: 'Công thức tính điểm Z (chỉ số dương tính - càng cao càng tốt)',
        formula: 'Z = \\frac{X - \\bar{X}}{S}',
        note: 'Dùng cho các môn bật xa, kéo xà, dung tích sống, số lần gập bụng.'
      },
      {
        name: 'Công thức tính điểm Z (chỉ số nghịch tính - thời gian càng nhỏ càng tốt)',
        formula: 'Z = \\frac{\\bar{X} - X}{S}',
        note: 'Dùng cho môn chạy cự ly 30m, 100m, 1500m.'
      },
      {
        name: 'Chuyển đổi sang điểm T',
        formula: 'T = 50 + 10 \\cdot Z',
        note: 'Thành tích trung bình ứng với T = 50 điểm.'
      }
    ],
    calculationSteps: [
      'Bước 1: Tính X̄ và S của toàn bộ nhóm sinh viên tham chiếu.',
      'Bước 2: Xác định tính chất chỉ số (thuận tính hay nghịch tính).',
      'Bước 3: Tính điểm Z của từng sinh viên.',
      'Bước 4: Tính điểm T = 50 + 10Z. Xếp loại: T >= 70 (Xuất sắc), 60-69 (Giỏi), 50-59 (Khá), 40-49 (Đạt/Trung bình), < 40 (Yếu).'
    ],
    sportExample: {
      title: 'So sánh thành tích Chạy 100m và Bật xa của sinh viên Tuấn',
      description: 'Cả lớp có: Chạy 100m (X̄₁ = 14.0s, S₁ = 0.5s); Bật xa tại chỗ (X̄₂ = 220cm, S₂ = 10cm). Sinh viên Tuấn chạy 100m hết 13.0s và bật xa được 235cm. Hỏi Tuấn có năng khiếu ở môn nào tốt hơn?',
      data: 'Tuấn: Chạy 100m = 13.0s; Bật xa = 235cm.',
      solutionSteps: [
        {
          step: '1. Tính điểm Z môn Chạy 100m (chỉ số nghịch tính)',
          content: 'Z_chay = (X̄₁ - X) / S₁ = (14.0 - 13.0) / 0.5 = +2.0. Điểm T = 50 + 10*(2.0) = 70 điểm.'
        },
        {
          step: '2. Tính điểm Z môn Bật xa (chỉ số thuận tính)',
          content: 'Z_bat = (X - X̄₂) / S₂ = (235 - 220) / 10 = +1.5. Điểm T = 50 + 10*(1.5) = 65 điểm.'
        },
        {
          step: '3. So sánh năng lực chuẩn hóa',
          content: 'Z_chay (+2.0) > Z_bat (+1.5). Ở môn chạy 100m, Tuấn vượt trội hơn mức trung bình của lớp tới 2 độ lệch chuẩn (top ~2.3% giỏi nhất lớp).'
        }
      ],
      conclusion: 'Dù cả hai môn Tuấn đều trên trung bình, nhưng năng khiếu Tốc độ (Chạy 100m) của Tuấn tốt hơn đáng kể so với Sức bật (Bật xa).'
    },
    pitfallsAndNotes: [
      'Quên đảo chiều công thức Z đối với các môn tính thời gian chạy (chạy 13s phải có điểm Z dương cao hơn chạy 15s).',
      'Chỉ áp dụng quy tắc 68-95-99.7% khi mẫu phân phối tiệm cận chuẩn. Nếu mẫu bị lệch nặng (Skewness xa 0), quy tắc này sẽ sai số lớn.'
    ]
  },
  {
    id: 'topic-4',
    topicNumber: 4,
    title: 'Chọn mẫu, Sai số chuẩn (SE) & Ước lượng khoảng tin cậy (CI)',
    subtitle: 'Độ tin cậy của số trung bình mẫu và khoảng biến thiên dự đoán của tổng thể',
    category: 'Suy luận thống kê',
    concepts: [
      'Sai số chuẩn của số trung bình (Standard Error of Mean - SE hoặc m): Phản ánh độ dao động ngẫu nhiên của các số trung bình mẫu thu được nếu lặp lại thí nghiệm nhiều lần.',
      'Quan hệ giữa SE và S: SE = S / √n. Cỡ mẫu n càng lớn thì sai số chuẩn càng nhỏ, số trung bình mẫu càng ước lượng chính xác trung bình tổng thể.',
      'Khoảng tin cậy 95% (95% Confidence Interval - CI): Khoảng giá trị chứa giá trị trung bình thực của toàn bộ sinh viên (tổng thể μ) với xác suất đúng 95%.',
      'Độ chính xác tương đối: Tỷ lệ (SE / X̄) * 100%. Trong nghiên cứu GDTC thường yêu cầu sai số tương đối không vượt quá 3% đến 5%.'
    ],
    formulaList: [
      {
        name: 'Sai số chuẩn của số trung bình (SE)',
        formula: 'SE = m_{\\bar{X}} = \\frac{S}{\\sqrt{n}}',
        note: 'S là độ lệch chuẩn mẫu, n là số quan sát.'
      },
      {
        name: 'Khoảng tin cậy 95% cho trung bình (mẫu nhỏ n < 30)',
        formula: 'CI_{95\\%} = \\left[ \\bar{X} - t_{0.05; df} \\cdot SE ; \\; \\bar{X} + t_{0.05; df} \\cdot SE \\right]',
        note: 'df = n - 1, tra bảng t Student hai phía.'
      },
      {
        name: 'Khoảng tin cậy 95% cho trung bình (mẫu lớn n >= 30)',
        formula: 'CI_{95\\%} = \\left[ \\bar{X} - 1.96 \\cdot SE ; \\; \\bar{X} + 1.96 \\cdot SE \\right]',
        note: 'Hệ số 1.96 lấy từ bảng phân phối chuẩn Z.'
      }
    ],
    calculationSteps: [
      'Bước 1: Tính số trung bình X̄ và độ lệch chuẩn S từ mẫu số liệu.',
      'Bước 2: Tính sai số chuẩn SE = S / √n.',
      'Bước 3: Xác định mức ý nghĩa alpha (thường 0.05 ứng với độ tin cậy 95%) và bậc tự do df = n - 1.',
      'Bước 4: Tra trị số tới hạn t_crit (hoặc dùng 1.96 nếu n >= 30) và tính sai số biên e = t_crit * SE.',
      'Bước 5: Thiết lập khoảng tin cậy: [X̄ - e; X̄ + e].'
    ],
    sportExample: {
      title: 'Ước lượng nhịp tim lúc nghỉ trung bình của sinh viên năm nhất',
      description: 'Đo nhịp tim lúc nghỉ của 36 sinh viên nam năm nhất: X̄ = 72.0 lần/phút, S = 6.0 lần/phút. Hãy xác định khoảng tin cậy 95% cho nhịp tim trung bình của toàn thể sinh viên nam năm nhất.',
      data: 'n = 36 sinh viên; X̄ = 72.0 bpm; S = 6.0 bpm; độ tin cậy 95% (Z = 1.96 do n > 30).',
      solutionSteps: [
        {
          step: '1. Tính sai số chuẩn SE',
          content: 'SE = S / √n = 6.0 / √36 = 6.0 / 6 = 1.0 lần/phút.'
        },
        {
          step: '2. Tính sai số biên (Margin of Error)',
          content: 'e = 1.96 * SE = 1.96 * 1.0 = 1.96 lần/phút.'
        },
        {
          step: '3. Tính cận dưới và cận trên của khoảng tin cậy',
          content: 'Cận dưới: 72.0 - 1.96 = 70.04 bpm; Cận trên: 72.0 + 1.96 = 73.96 bpm.'
        }
      ],
      conclusion: 'Với độ tin cậy 95%, nhịp tim lúc nghỉ trung bình của toàn thể sinh viên nam năm nhất dao động trong khoảng từ 70.04 đến 73.96 lần/phút.'
    },
    pitfallsAndNotes: [
      'Phân biệt rõ: Độ lệch chuẩn S biểu thị sự phân tán giữa các cá thể sinh viên; trong khi Sai số chuẩn SE biểu thị độ bất định của giá trị trung bình X̄.',
      'Báo cáo kết quả theo chuẩn khoa học TDTT: X̄ ± SE hoặc X̄ (95% CI: Cận dưới - Cận trên).'
    ]
  },
  {
    id: 'topic-5',
    topicNumber: 5,
    title: 'Kiểm định giả thuyết, Sai lầm loại I, II & Ý nghĩa p-value',
    subtitle: 'Khung lý thuyết kiểm định quyết định sư phạm trong huấn luyện thể thao',
    category: 'Suy luận thống kê',
    concepts: [
      'Giả thuyết Không (H0 - Null Hypothesis): Giả thuyết khẳng định không có sự khác biệt hoặc không có hiệu quả (VD: Phương pháp tập luyện mới không làm tăng sức bền so với phương pháp cũ).',
      'Giả thuyết Đối (H1 - Alternative Hypothesis): Giả thuyết nghiên cứu kỳ vọng chứng minh (VD: Phương pháp tập mới làm tăng sức bền có ý nghĩa).',
      'Mức ý nghĩa thống kê (α - Alpha): Xác suất tối đa chấp nhận mắc sai lầm loại I. Trong TDTT, quy chuẩn chung là α = 0.05 (độ tin cậy 95%) hoặc α = 0.01 (độ tin cậy 99%).',
      'Sai lầm loại I (Bác bỏ đúng H0 khi H0 thực sự đúng): Kết luận phương pháp mới có hiệu quả trong khi thực tế chỉ do ngẫu nhiên (dương tính giả).',
      'Sai lầm loại II (Chấp nhận H0 khi H0 thực tế sai): Bỏ lỡ một phương pháp tập luyện thực sự hiệu quả (âm tính giả).',
      'Trị số p (p-value): Xác suất nhận được kết quả chênh lệch bằng hoặc lớn hơn thực tế nếu giả thuyết H0 là đúng.',
      'Quy tắc vàng ra quyết định:',
      '• Nếu p < α (thường là p < 0.05): Bác bỏ H0, thừa nhận H1 -> Sự khác biệt có ý nghĩa thống kê.',
      '• Nếu p >= α (p >= 0.05): Chưa đủ bằng chứng bác bỏ H0 -> Sự khác biệt chưa có ý nghĩa thống kê (có thể do ngẫu nhiên).'
    ],
    formulaList: [
      {
        name: 'Công thức logic kiểm định',
        formula: 'p < \\alpha \\implies \\text{Bác bỏ } H_0, \\quad p \\ge \\alpha \\implies \\text{Chưa thể bác bỏ } H_0',
        note: 'Mức chuẩn trong TDTT: α = 0.05.'
      }
    ],
    calculationSteps: [
      'Bước 1: Thiết lập cặp giả thuyết H0 và H1.',
      'Bước 2: Chọn mức ý nghĩa α (0.05).',
      'Bước 3: Lựa chọn tiêu chuẩn kiểm định phù hợp (t-test, ANOVA, Chi bình phương).',
      'Bước 4: Tính toán giá trị thực nghiệm của đại lượng thống kê (t_qs, F_qs, chi2_qs) và p-value tương ứng.',
      'Bước 5: So sánh p-value với α và đưa ra kết luận thực tiễn sư phạm.'
    ],
    sportExample: {
      title: 'Đánh giá giáo án tập cơ bụng bằng kiểm định thống kê',
      description: 'Giảng viên thử nghiệm giáo án gập bụng mới trong 8 tuần. Sau khi chạy phần mềm thống kê so sánh trước và sau tập, kết quả cho ra p = 0.018 ở mức α = 0.05.',
      data: 'p = 0.018; α = 0.05.',
      solutionSteps: [
        {
          step: '1. So sánh p-value với α',
          content: 'p = 0.018 < α = 0.05.'
        },
        {
          step: '2. Quyết định thống kê',
          content: 'Bác bỏ giả thuyết H0 (không có tiến bộ), chấp nhận giả thuyết H1 (có sự tiến bộ).'
        },
        {
          step: '3. Diễn giải sư phạm',
          content: 'Khả năng sự tiến bộ này xảy ra do may rủi ngẫu nhiên chỉ là 1.8% (< 5%). Do đó khẳng định giáo án tập luyện mới đã đem lại hiệu quả tăng sức bền cơ bụng rõ rệt có ý nghĩa thống kê.'
        }
      ],
      conclusion: 'Giảng viên hoàn toàn có cơ sở khoa học để đưa giáo án mới vào áp dụng đại trà cho sinh viên toàn khóa.'
    },
    pitfallsAndNotes: [
      'Ý nghĩa thống kê (p < 0.05) không đồng nghĩa với Ý nghĩa thực tiễn: Với mẫu cực lớn (n = 1000), sự chênh lệch chạy 100m chỉ 0.02 giây cũng có thể đạt p < 0.05 nhưng ý nghĩa thể lực lại rất nhỏ. Do đó cần tính thêm cỡ ảnh hưởng (Effect size - Cohen d).',
      'Không bao giờ được nói "Chấp nhận tuyệt đối H0", mà chỉ nói "Chưa đủ cơ sở thống kê để bác bỏ H0".'
    ]
  },
  {
    id: 'topic-6',
    topicNumber: 6,
    title: 'Kiểm định t (Student t-test) trong đánh giá thể lực',
    subtitle: 'So sánh 1 mẫu, 2 mẫu độc lập (Independent t-test) và 2 mẫu ghép cặp trước - sau (Paired t-test)',
    category: 'Kiểm định tham số',
    concepts: [
      'One-sample t-test: So sánh số trung bình của 1 mẫu sinh viên với một giá trị chuẩn mực đã biết trước (VD: So sánh dung tích sống của lớp với chuẩn thể lực quốc gia 3200ml).',
      'Independent samples t-test: So sánh trung bình của 2 nhóm hoàn toàn độc lập (VD: So sánh sức bật giữa nhóm Nam và nhóm Nữ, hoặc nhóm dùng phương pháp tập tạ vs nhóm dùng dây kháng lực). Gồm 2 dạng: Student t-test (khi 2 nhóm có phương sai đồng nhất) và Welch t-test (khi phương sai không đồng nhất).',
      'Paired samples t-test: So sánh 2 lần đo trên CÙNG MỘT NHÓM đối tượng tại hai thời điểm khác nhau (VD: Đo thành tích chạy 1500m của nhóm trước và sau khóa tập huấn 8 tuần). Triệt tiêu được sự khác biệt bẩm sinh giữa các cá thể.',
      'Cỡ ảnh hưởng Cohen’s d: Đo lường độ lớn thực chất của sự khác biệt: |d| = 0.2 (nhỏ), 0.5 (trung bình), >= 0.8 (lớn).'
    ],
    formulaList: [
      {
        name: 'Independent t-test (phương sai đồng nhất)',
        formula: 't = \\frac{\\bar{X}_1 - \\bar{X}_2}{S_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}, \\quad S_p^2 = \\frac{(n_1-1)S_1^2 + (n_2-1)S_2^2}{n_1 + n_2 - 2}',
        note: 'df = n1 + n2 - 2.'
      },
      {
        name: 'Paired t-test (ghép cặp trước - sau)',
        formula: 't = \\frac{\\bar{D}}{\\frac{S_D}{\\sqrt{n}}}, \\quad D_i = X_{\\text{sau}, i} - X_{\\text{trước}, i}',
        note: 'df = n - 1, D là độ chênh lệch của từng sinh viên.'
      },
      {
        name: 'Cohen’s d (Paired)',
        formula: 'd = \\frac{\\bar{D}}{S_D}',
        note: 'Mức độ hiệu quả huấn luyện thực tế.'
      }
    ],
    calculationSteps: [
      'Bước 1: Xác định kiểu so sánh (độc lập hay ghép cặp lặp lại).',
      'Bước 2: Kiểm tra giả định phân phối chuẩn (Shapiro-Wilk) và phương sai đồng nhất (Levene test).',
      'Bước 3: Tính giá trị t theo công thức tương ứng và xác định bậc tự do df.',
      'Bước 4: Tra bảng t hoặc tính p-value hai phía.',
      'Bước 5: Tính cỡ ảnh hưởng Cohen d và viết báo cáo chuẩn khoa học.'
    ],
    sportExample: {
      title: 'Đánh giá hiệu quả bài tập tạ nhảy đối với sức bật của 5 VĐV bóng rổ',
      description: 'Thành tích bật cao (cm) của 5 VĐV trước tập: [48, 50, 46, 52, 49]; sau 6 tuần tập: [52, 55, 50, 56, 52].',
      data: 'Độ chênh lệch D = Sau - Trước: [4, 5, 4, 4, 3] cm. n = 5.',
      solutionSteps: [
        {
          step: '1. Tính chênh lệch trung bình D̄',
          content: 'D = [4, 5, 4, 4, 3]. Tổng D = 20. D̄ = 20 / 5 = 4.0 cm.'
        },
        {
          step: '2. Tính độ lệch chuẩn của chênh lệch SD',
          content: 'Bình phương sai lệch: (4-4)² + (5-4)² + (4-4)² + (4-4)² + (3-4)² = 0 + 1 + 0 + 0 + 1 = 2. SD² = 2 / (5 - 1) = 0.5. SD = √0.5 ≈ 0.707 cm.'
        },
        {
          step: '3. Tính giá trị kiểm định t',
          content: 't = D̄ / (SD / √n) = 4.0 / (0.707 / √5) = 4.0 / (0.707 / 2.236) = 4.0 / 0.316 ≈ 12.65.'
        },
        {
          step: '4. Kết luận thống kê',
          content: 'Với df = 4, tra bảng t ở mức α = 0.05 thì t_crit = 2.776. Vì t = 12.65 > 2.776 (p < 0.001), sự cải thiện sức bật là cực kỳ có ý nghĩa thống kê.'
        },
        {
          step: '5. Tính cỡ ảnh hưởng Cohen d',
          content: 'd = D̄ / SD = 4.0 / 0.707 ≈ 5.65 (hiệu ứng cực lớn).'
        }
      ],
      conclusion: 'Bài tập tạ nhảy đã giúp tăng sức bật trung bình 4.0 cm cho các VĐV bóng rổ một cách rất vững chắc và hiệu quả vượt bậc.'
    },
    pitfallsAndNotes: [
      'Dùng nhầm Independent t-test cho số liệu đo trước-sau trên cùng một người: Làm mất tính tương quan nội cá thể, giảm mạnh lực lượng thống kê (power).',
      'Nếu cỡ mẫu quá nhỏ và dữ liệu vi phạm phân phối chuẩn, phải chuyển sang kiểm định phi tham số Wilcoxon (cho cặp) hoặc Mann-Whitney U (cho độc lập).'
    ]
  },
  {
    id: 'topic-7',
    topicNumber: 7,
    title: 'Kiểm định Chi bình phương (χ²) cho dữ liệu đếm trong TDTT',
    subtitle: 'Kiểm định tính độc lập và độ phù hợp của phân bố tần số phân loại',
    category: 'Kiểm định phi tham số',
    concepts: [
      'Dữ liệu đếm/Tần số: Số lượng sinh viên rơi vào các nhóm phân loại (VD: Số SV đạt loại Giỏi, Khá, Trung bình; Tỷ lệ chấn thương gối ở môn Bóng đá vs Bóng rổ).',
      'Kiểm định Chi bình phương độc lập (Chi-square test of independence): Đánh giá xem có mối liên hệ giữa hai biến phân loại hay không (VD: Có mối liên hệ giữa nhóm giới tính và sở thích môn thể thao tự chọn không?).',
      'Tần số quan sát (Observed - O): Số liệu thực tế đếm được trong cuộc điều tra.',
      'Tần số lý thuyết kỳ vọng (Expected - E): Số liệu kỳ vọng nếu giả thuyết hai biến độc lập hoàn toàn là đúng: E = (Tổng hàng * Tổng cột) / Tổng chung.'
    ],
    formulaList: [
      {
        name: 'Đại lượng thống kê Chi bình phương',
        formula: '\\chi^2 = \\sum \\frac{(O - E)^2}{E}',
        note: 'Bậc tự do df = (Số hàng - 1) * (Số cột - 1).'
      },
      {
        name: 'Tần số lý thuyết E',
        formula: 'E_{ij} = \\frac{R_i \\times C_j}{N}',
        note: 'Điều kiện áp dụng: Không quá 20% số ô có E < 5 và không ô nào có E < 1.'
      }
    ],
    calculationSteps: [
      'Bước 1: Lập bảng tiếp liên (Contingency table) gồm các tần số quan sát O.',
      'Bước 2: Tính tổng các hàng, tổng các cột và tổng toàn bộ N.',
      'Bước 3: Tính tần số kỳ vọng E cho từng ô.',
      'Bước 4: Tính tổng đại lượng (O - E)² / E trên tất cả các ô.',
      'Bước 5: Xác định bậc tự do df = (r - 1)(c - 1) và so sánh chi2 với giá trị tới hạn để đưa ra kết luận.'
    ],
    sportExample: {
      title: 'Khảo sát tỷ lệ chấn thương cổ chân giữa môn Bóng đá và Bóng chuyền',
      description: 'Khảo sát 100 sinh viên Bóng đá thấy 30 người từng chấn thương cổ chân, 70 người không. Khảo sát 100 sinh viên Bóng chuyền thấy 15 người từng chấn thương, 85 người không.',
      data: 'Bóng đá: 30 CT, 70 KCT; Bóng chuyền: 15 CT, 85 KCT. N = 200.',
      solutionSteps: [
        {
          step: '1. Tính tổng hàng và cột',
          content: 'Tổng chấn thương = 30 + 15 = 45; Không CT = 70 + 85 = 155. Mỗi môn n = 100.'
        },
        {
          step: '2. Tính tần số kỳ vọng E',
          content: 'E(Bóng đá, CT) = (100 * 45) / 200 = 22.5; E(Bóng chuyền, CT) = 22.5. E(Bóng đá, KCT) = (100 * 155) / 200 = 77.5; E(Bóng chuyền, KCT) = 77.5.'
        },
        {
          step: '3. Tính giá trị χ²',
          content: 'χ² = (30 - 22.5)²/22.5 + (70 - 77.5)²/77.5 + (15 - 22.5)²/22.5 + (85 - 77.5)²/77.5 = 2.5 + 0.726 + 2.5 + 0.726 ≈ 6.45.'
        },
        {
          step: '4. So sánh với giá trị tới hạn',
          content: 'df = (2 - 1) * (2 - 1) = 1. Tra bảng χ² ở α = 0.05, df = 1 thì χ²_crit = 3.841. Vì 6.45 > 3.841 (p ≈ 0.011 < 0.05).'
        }
      ],
      conclusion: 'Có mối liên hệ có ý nghĩa thống kê giữa bộ môn tập luyện và nguy cơ chấn thương cổ chân. Sinh viên môn Bóng đá có tỷ lệ chấn thương cổ chân cao hơn rõ rệt so với Bóng chuyền.'
    },
    pitfallsAndNotes: [
      'Không dùng Chi bình phương trên số liệu phần trăm (%) mà bắt buộc phải dùng tần số đếm nguyên (người, lần).',
      'Nếu bảng 2x2 mà có ô tần số kỳ vọng E < 5, phải dùng kiểm định chính xác Fisher (Fisher’s Exact Test) hoặc hiệu chỉnh Yates.'
    ]
  },
  {
    id: 'topic-8',
    topicNumber: 8,
    title: 'Phân tích phương sai một yếu tố (One-way ANOVA)',
    subtitle: 'So sánh thành tích thể lực giữa từ 3 nhóm độc lập trở lên và kiểm định hậu nghiệm Post-Hoc',
    category: 'Kiểm định tham số đa nhóm',
    concepts: [
      'Mục đích của ANOVA: So sánh số trung bình của 3 nhóm trở lên (VD: So sánh sức bền giữa 3 khoa: Giáo dục Thể chất, Sư phạm Toán, Giáo dục Tiểu học; hoặc so sánh 3 phương pháp khởi động khác nhau).',
      'Tại sao không dùng nhiều phép t-test độc lập?: Nếu so sánh 3 nhóm (A vs B, B vs C, A vs C), việc thực hiện 3 phép t-test ở mức α = 0.05 sẽ làm tăng xác suất sai lầm loại I tích lũy lên tới 1 - (1 - 0.05)³ ≈ 14.3% (hiện tượng lạm phát sai lầm Family-wise Error Rate). ANOVA kiểm soát sai lầm này ở mức chính xác 5%.',
      'Bản chất của tiêu chuẩn Fisher F: Tỷ số giữa Biến thiên giữa các nhóm (Between-groups variance - do tác động phương pháp) và Biến thiên nội bộ nhóm (Within-groups variance - do sai số ngẫu nhiên).',
      'Kiểm định hậu nghiệm (Post-hoc test): Khi ANOVA cho F có ý nghĩa thống kê (p < 0.05), ta mới tiến hành so sánh từng cặp (Tukey HSD, Bonferroni, Scheffe) để biết chính xác nhóm nào khác biệt với nhóm nào.'
    ],
    formulaList: [
      {
        name: 'Tiêu chuẩn F của ANOVA',
        formula: 'F = \\frac{MS_{\\text{between}}}{MS_{\\text{within}}} = \\frac{SS_{\\text{between}} / (k - 1)}{SS_{\\text{within}} / (N - k)}',
        note: 'k là số nhóm, N là tổng số quan sát.'
      },
      {
        name: 'Tổng bình phương độ lệch toàn phần',
        formula: 'SS_{\\text{total}} = SS_{\\text{between}} + SS_{\\text{within}}',
        note: 'Phân rã biến lượng.'
      }
    ],
    calculationSteps: [
      'Bước 1: Tính trung bình của từng nhóm \\bar{X}_j và trung bình chung toàn thể \\bar{X}_{\\text{grand}}.',
      'Bước 2: Tính tổng bình phương giữa các nhóm SS_between và trong nội bộ nhóm SS_within.',
      'Bước 3: Chia cho các bậc tự do df1 = k - 1 và df2 = N - k để nhận MS_between và MS_within.',
      'Bước 4: Tính tỷ số F = MS_between / MS_within và tra bảng phân phối F.',
      'Bước 5: Nếu F có ý nghĩa (p < 0.05), chạy Post-hoc Tukey HSD để kết luận chi tiết.'
    ],
    sportExample: {
      title: 'So sánh sức bền chạy con thoi 4x10m của 3 phương pháp hồi phục',
      description: 'Ba nhóm sinh viên (mỗi nhóm n = 5) áp dụng 3 biện pháp hồi phục sau tập nặng: Nhóm 1: Ngồi nghỉ thụ động; Nhóm 2: Chạy thả lỏng tích cực; Nhóm 3: Ngâm nước lạnh.',
      data: 'k = 3 nhóm, mỗi nhóm 5 SV, tổng N = 15. Kết quả ANOVA tính được: SS_between = 48.0, SS_within = 24.0.',
      solutionSteps: [
        {
          step: '1. Tính bậc tự do df',
          content: 'df_between = k - 1 = 3 - 1 = 2; df_within = N - k = 15 - 3 = 12.'
        },
        {
          step: '2. Tính trung bình bình phương (MS)',
          content: 'MS_between = 48.0 / 2 = 24.0; MS_within = 24.0 / 12 = 2.0.'
        },
        {
          step: '3. Tính giá trị thực nghiệm F',
          content: 'F = MS_between / MS_within = 24.0 / 2.0 = 12.0.'
        },
        {
          step: '4. Kết luận kiểm định',
          content: 'Tra bảng F ở mức α = 0.05 với df(2, 12) có F_crit = 3.89. Do F = 12.0 > 3.89 (p = 0.001 < 0.05), bác bỏ H0.'
        }
      ],
      conclusion: 'Tồn tại sự khác biệt rất có ý nghĩa thống kê giữa 3 biện pháp hồi phục. Kiểm tra sâu cho thấy biện pháp ngâm nước lạnh và thả lỏng tích cực giúp hồi phục thành tích chạy con thoi nhanh hơn vượt trội so với ngồi nghỉ thụ động.'
    },
    pitfallsAndNotes: [
      'Không được chạy Post-hoc test nếu kết quả phân tích tổng thể ANOVA không có ý nghĩa thống kê (F có p >= 0.05).',
      'Nếu dữ liệu vi phạm nặng giả định phương sai đồng nhất hoặc phân phối chuẩn, phương pháp phi tham số thay thế là Kiểm định Kruskal-Wallis.'
    ]
  },
  {
    id: 'topic-9',
    topicNumber: 9,
    title: 'Hệ số tương quan (Pearson, Spearman) & Hồi quy tuyến tính',
    subtitle: 'Mối liên hệ giữa các tố chất thể lực và mô hình dự báo thành tích thể thao',
    category: 'Mối quan hệ & Dự báo',
    concepts: [
      'Hệ số tương quan Pearson (r): Đo mức độ liên hệ tuyến tính giữa hai biến định lượng có phân phối chuẩn. Giá trị r nằm trong đoạn [-1; +1].',
      'Ý nghĩa độ lớn hệ số tương quan r:',
      '• |r| < 0.3: Tương quan yếu.',
      '• 0.3 <= |r| < 0.7: Tương quan trung bình.',
      '• 0.7 <= |r| < 0.9: Tương quan chặt chẽ.',
      '• |r| >= 0.9: Tương quan rất chặt chẽ.',
      'Hệ số tương quan hạng Spearman (rho - ρ): Dùng khi dữ liệu ở thang đo thứ bậc hoặc không tuân theo phân phối chuẩn.',
      'Hệ số xác định (R² - R-squared): Cho biết bao nhiêu phần trăm (%) sự biến thiên của biến thành tích Y được giải thích bởi biến thể lực X.',
      'Hồi quy tuyến tính đơn giản: Phương trình toán học dạng Y = aX + b dùng để dự báo thành tích tương lai dựa trên chỉ số thể lực hiện tại.'
    ],
    formulaList: [
      {
        name: 'Hệ số tương quan Pearson',
        formula: 'r = \\frac{\\sum (X - \\bar{X})(Y - \\bar{Y})}{\\sqrt{\\sum (X - \\bar{X})^2 \\sum (Y - \\bar{Y})^2}}',
        note: '-1 <= r <= 1.'
      },
      {
        name: 'Phương trình hồi quy tuyến tính',
        formula: '\\hat{Y} = aX + b, \\quad a = \\frac{\\sum (X - \\bar{X})(Y - \\bar{Y})}{\\sum (X - \\bar{X})^2}, \\quad b = \\bar{Y} - a\\bar{X}',
        note: 'a là hệ số góc (độ dốc), b là tung độ gốc.'
      }
    ],
    calculationSteps: [
      'Bước 1: Lập biểu đồ phân tán (Scatter plot) để quan sát xu hướng liên hệ.',
      'Bước 2: Tính số trung bình X̄, Ȳ và các tổng bình phương sai lệch.',
      'Bước 3: Tính hệ số tương quan r và kiểm định ý nghĩa thống kê của r (kiểm định t với df = n - 2).',
      'Bước 4: Tính hệ số góc a và hệ số tự do b để lập phương trình dự báo.',
      'Bước 5: Tính hệ số xác định R² = r² và đánh giá độ tin cậy của mô hình.'
    ],
    sportExample: {
      title: 'Mối tương quan giữa Sức bật cao (X, cm) và Thành tích nhảy xa (Y, cm)',
      description: 'Đo trên 10 sinh viên chuyên sâu điền kinh, thu được r = +0.85 (tương quan chặt chẽ) với phương trình hồi quy Y = 1.8X + 160 (cm).',
      data: 'r = 0.85; R² = 0.7225; Y = 1.8X + 160.',
      solutionSteps: [
        {
          step: '1. Diễn giải hệ số tương quan r',
          content: 'r = +0.85 mang dấu dương, cho thấy VĐV có sức bật cao càng tốt thì thành tích nhảy xa càng xa, mối liên hệ này rất chặt chẽ.'
        },
        {
          step: '2. Diễn giải hệ số xác định R²',
          content: 'R² = 0.85² ≈ 0.723 (72.3%). Tức là 72.3% sự biến thiên thành tích nhảy xa có thể giải thích được trực tiếp thông qua sức bật cao.'
        },
        {
          step: '3. Ứng dụng dự báo thành tích',
          content: 'Nếu một sinh viên rèn luyện nâng sức bật cao từ 50cm lên 55cm (tăng 5cm), thành tích nhảy xa dự báo sẽ đạt: Y = 1.8 * 55 + 160 = 99 + 160 = 259 cm (tăng thêm 1.8 * 5 = 9.0 cm).'
        }
      ],
      conclusion: 'Mô hình hồi quy cho phép giảng viên lượng hóa chính xác mức độ đóng góp của sức mạnh bột phát chân vào thành tích thi đấu nhảy xa.'
    },
    pitfallsAndNotes: [
      'NGUYÊN TẮC CỐT TỬ: "Tương quan không đồng nghĩa với Nhân quả" (Correlation does not imply causation). Hai biến có r cao có thể cùng chịu ảnh hưởng của một biến thứ ba (ví dụ chiều dài chân hoặc độ tuổi).',
      'Hệ số Pearson rất nhạy cảm với các điểm dị biệt (outliers). Một điểm ngoại lai có thể làm sai lệch hoàn toàn giá trị r.'
    ]
  },
  {
    id: 'topic-10',
    topicNumber: 10,
    title: 'Đánh giá Test trong TDTT: Độ tin cậy & Độ giá trị',
    subtitle: 'Các tiêu chuẩn khoa học để lựa chọn và chuẩn hóa bài test kiểm tra thể lực',
    category: 'Đo lường thể thao',
    concepts: [
      'Tính chất của Test TDTT: Một bài tập hoặc phép đo được chuẩn hóa dùng để đánh giá năng lực thể chất hoặc kỹ thuật.',
      'Độ tin cậy của Test (Reliability): Mức độ ổn định và nhất quán của kết quả khi lặp lại phép đo trên cùng một đối tượng trong cùng điều kiện. Thường đánh giá qua hệ số tương quan test-retest (r_tt).',
      'Tiêu chuẩn hệ số tương quan test-retest:',
      '• r_tt >= 0.85: Test có độ tin cậy tốt, đủ tiêu chuẩn sử dụng.',
      '• 0.70 <= r_tt < 0.85: Độ tin cậy trung bình, cần kiểm soát chặt chẽ quy trình đo.',
      '• r_tt < 0.70: Độ tin cậy kém, không được phép đưa vào kiểm tra chính thức.',
      'Độ giá trị của Test (Validity / Tính thông báo): Mức độ mà bài test đo lường đúng cái nó cần đo (VD: Test chạy con thoi 4x10m phải đo đúng độ khéo léo biến tốc chứ không phải chỉ là sức bền hiếu khí).',
      'Tính khách quan (Objectivity): Mức độ trùng khớp kết quả khi hai giám khảo khác nhau cùng chấm một bài kiểm tra trên cùng một sinh viên (r_inter-rater).'
    ],
    formulaList: [
      {
        name: 'Hệ số tương quan Test-Retest',
        formula: 'r_{tt} = \\frac{\\sum (X_1 - \\bar{X}_1)(X_2 - \\bar{X}_2)}{\\sqrt{\\sum (X_1 - \\bar{X}_1)^2 \\sum (X_2 - \\bar{X}_2)^2}}',
        note: 'X1 là lần đo 1, X2 là lần đo 2 lặp lại sau 1-3 ngày.'
      }
    ],
    calculationSteps: [
      'Bước 1: Chuẩn bị quy trình đo đồng nhất về thời gian, dụng cụ, sân bãi và người đo.',
      'Bước 2: Tiến hành kiểm tra lần 1 ghi nhận điểm số X1.',
      'Bước 3: Cho đối tượng nghỉ ngơi hồi phục hoàn toàn (thường sau 24-48 giờ) rồi tiến hành kiểm tra lần 2 ghi nhận X2.',
      'Bước 4: Tính hệ số tương quan r_tt giữa X1 và X2.',
      'Bước 5: So sánh r_tt với ngưỡng chuẩn 0.85 để nghiệm thu bài test.'
    ],
    sportExample: {
      title: 'Kiểm định độ tin cậy của test "Ném bóng rổ tại chỗ vào rổ 1 phút"',
      description: 'Cho 20 sinh viên thực hiện test 2 lần cách nhau 2 ngày. Kết quả tính toán thu được r_tt = 0.89 (p < 0.001).',
      data: 'n = 20; r_tt = 0.89.',
      solutionSteps: [
        {
          step: '1. So sánh với tiêu chuẩn đo lường TDTT',
          content: 'r_tt = 0.89 > 0.85, đạt ngưỡng độ tin cậy cao.'
        },
        {
          step: '2. Đánh giá ý nghĩa thống kê',
          content: 'p < 0.001 chứng minh mối tương quan không phải do ngẫu nhiên.'
        }
      ],
      conclusion: 'Bài test "Ném bóng rổ tại chỗ vào rổ 1 phút" có độ ổn định rất cao, đủ điều kiện khoa học để chọn làm bài thi kết thúc học phần môn Bóng rổ.'
    },
    pitfallsAndNotes: [
      'Khoảng thời gian giữa 2 lần test: Nếu quá ngắn sẽ bị ảnh hưởng bởi mệt mỏi; nếu quá dài đối tượng có thể đã tiến bộ nhờ tập luyện ngoài giờ làm sai lệch r_tt.',
      'Một test có độ tin cậy cao chưa chắc đã có độ giá trị cao (đo rất ổn định nhưng lại đo nhầm tố chất).'
    ]
  },
  {
    id: 'topic-11',
    topicNumber: 11,
    title: 'Ứng dụng thực tế: So sánh giáo án & Xây dựng thang điểm TDTT',
    subtitle: 'Quy trình khoa học hoàn chỉnh từ thu thập số liệu đến xây dựng thang đánh giá thể lực sinh viên',
    category: 'Ứng dụng thực tế',
    concepts: [
      'Phương pháp thử nghiệm sư phạm (Pedagogical Experiment): Chia nhóm ngẫu nhiên có kiểm soát thành Nhóm Đối chứng (Control Group) và Nhóm Thực nghiệm (Experimental Group).',
      'Đánh giá nhịp tăng trưởng thành tích (Công thức Brody W%): Lượng hóa tốc độ tiến bộ của VĐV trong một chu kỳ huấn luyện.',
      'Xây dựng thang điểm thể lực học đường: Sử dụng phân phối chuẩn để chia thang điểm 10 hoặc xếp loại tiêu chuẩn (Z-score hoặc T-score):',
      '• Điểm 10 (Xuất sắc): X >= X̄ + 2.0S',
      '• Điểm 8 - 9 (Giỏi): X̄ + 1.0S <= X < X̄ + 2.0S',
      '• Điểm 6 - 7 (Khá): X̄ <= X < X̄ + 1.0S',
      '• Điểm 5 (Trung bình/Đạt): X̄ - 1.0S <= X < X̄',
      '• Dưới 5 (Yếu): X < X̄ - 1.0S'
    ],
    formulaList: [
      {
        name: 'Công thức nhịp tăng trưởng Brody (W%)',
        formula: 'W = \\frac{V_2 - V_1}{\\frac{1}{2}(V_1 + V_2)} \\times 100\\%',
        note: 'V1 là thành tích ban đầu, V2 là thành tích sau chu kỳ huấn luyện.'
      }
    ],
    calculationSteps: [
      'Bước 1: Kiểm tra tính đồng đều của hai nhóm trước thực nghiệm bằng t-test độc lập (yêu cầu p > 0.05 để đảm bảo xuất phát điểm tương đương).',
      'Bước 2: Tiến hành thực nghiệm giáo án trong 8-12 tuần.',
      'Bước 3: Kiểm tra sau thực nghiệm: So sánh nội bộ từng nhóm bằng Paired t-test và so sánh giữa 2 nhóm bằng Independent t-test.',
      'Bước 4: Tính tốc độ tăng trưởng W% của hai nhóm và so sánh.',
      'Bước 5: Lập bảng thang điểm dựa trên X̄ và S của toàn thể sinh viên.'
    ],
    sportExample: {
      title: 'Đánh giá tốc độ tăng trưởng thành tích chạy 100m của sinh viên',
      description: 'Sinh viên An đầu kỳ chạy 100m đạt 14.5 giây (V1). Sau 1 học kỳ tích cực tập luyện, cuối kỳ chạy đạt 13.5 giây (V2). Tính nhịp tăng trưởng Brody W%.',
      data: 'V1 = 14.5s; V2 = 13.5s.',
      solutionSteps: [
        {
          step: '1. Lưu ý môn chạy là chỉ số nghịch tính',
          content: 'Thành tích giảm từ 14.5s xuống 13.5s là tiến bộ. Ta lấy hiệu số tuyệt đối mức cải thiện: |13.5 - 14.5| = 1.0s.'
        },
        {
          step: '2. Tính thành tích trung bình cộng hai thời điểm',
          content: '0.5 * (14.5 + 13.5) = 14.0s.'
        },
        {
          step: '3. Áp dụng công thức Brody',
          content: 'W = (1.0 / 14.0) * 100% ≈ 7.14%.'
        }
      ],
      conclusion: 'Nhịp tăng trưởng thành tích chạy 100m của sinh viên An đạt 7.14%, thể hiện hiệu quả huấn luyện rất tích cực.'
    },
    pitfallsAndNotes: [
      'Quên kiểm tra tính tương đương của hai nhóm trước thực nghiệm: Nếu nhóm thực nghiệm ban đầu đã giỏi hơn sẵn thì không thể quy kết kết quả cuối cùng là do phương pháp mới.',
      'Xây dựng thang điểm đánh giá phải tính riêng cho Nam và Nữ do đặc thù sinh học và sức mạnh cơ bắp khác biệt rõ rệt.'
    ]
  }
];

export interface DecisionTreeItem {
  id: string;
  dataNature: string;
  groupCount: string;
  sampleRelation: string;
  purpose: string;
  recommendedMethod: string;
  symbol: string;
  condition: string;
}

export const STATISTICAL_DECISION_TABLE: DecisionTreeItem[] = [
  {
    id: 'dt-1',
    dataNature: 'Định lượng (Tỷ lệ/Khoảng)',
    groupCount: '1 nhóm',
    sampleRelation: 'So với 1 hằng số chuẩn',
    purpose: 'So sánh thành tích mẫu với chuẩn mực thể lực quốc gia',
    recommendedMethod: 'One-sample t-test',
    symbol: 't',
    condition: 'Dữ liệu phân phối chuẩn'
  },
  {
    id: 'dt-2',
    dataNature: 'Định lượng',
    groupCount: '2 nhóm',
    sampleRelation: 'Độc lập (Nam vs Nữ, Nhóm A vs B)',
    purpose: 'So sánh thành tích giữa 2 nhóm đối tượng khác nhau',
    recommendedMethod: 'Independent samples t-test (Student hoặc Welch)',
    symbol: 't',
    condition: 'Chuẩn, Levene test kiểm tra phương sai'
  },
  {
    id: 'dt-3',
    dataNature: 'Định lượng',
    groupCount: '1 nhóm (2 thời điểm)',
    sampleRelation: 'Phụ thuộc (Ghép cặp Trước vs Sau)',
    purpose: 'Đánh giá sự tiến bộ của VĐV trước và sau tập huấn',
    recommendedMethod: 'Paired samples t-test',
    symbol: 't',
    condition: 'Độ chênh lệch phân phối chuẩn'
  },
  {
    id: 'dt-4',
    dataNature: 'Định lượng',
    groupCount: 'Từ 3 nhóm trở lên',
    sampleRelation: 'Độc lập',
    purpose: 'So sánh hiệu quả của 3 phương pháp huấn luyện khác nhau',
    recommendedMethod: 'Phân tích phương sai một yếu tố (One-way ANOVA)',
    symbol: 'F',
    condition: 'Phân phối chuẩn, phương sai đồng nhất'
  },
  {
    id: 'dt-5',
    dataNature: 'Định lượng',
    groupCount: '2 biến trên 1 nhóm',
    sampleRelation: 'Cặp quan sát',
    purpose: 'Xác định mối quan hệ tương quan giữa 2 tố chất thể lực (chiều cao vs bật xa)',
    recommendedMethod: 'Hệ số tương quan Pearson (r) & Hồi quy tuyến tính',
    symbol: 'r, R²',
    condition: 'Tuyến tính, phân phối chuẩn 2 chiều'
  },
  {
    id: 'dt-6',
    dataNature: 'Định lượng (vi phạm chuẩn) hoặc Thứ bậc',
    groupCount: '2 nhóm độc lập',
    sampleRelation: 'Độc lập',
    purpose: 'So sánh 2 nhóm khi cỡ mẫu nhỏ (n < 15) và không chuẩn',
    recommendedMethod: 'Kiểm định Mann-Whitney U',
    symbol: 'U',
    condition: 'Phi tham số'
  },
  {
    id: 'dt-7',
    dataNature: 'Định lượng (vi phạm chuẩn)',
    groupCount: '1 nhóm đo lặp lại',
    sampleRelation: 'Ghép cặp Trước vs Sau',
    purpose: 'So sánh trước sau khi dữ liệu không chuẩn',
    recommendedMethod: 'Kiểm định dấu hạng Wilcoxon',
    symbol: 'W / Z',
    condition: 'Phi tham số'
  },
  {
    id: 'dt-8',
    dataNature: 'Định tính / Tần số đếm (người, ca)',
    groupCount: 'Bảng tiếp liên 2x2 hoặc R x C',
    sampleRelation: 'Độc lập',
    purpose: 'Kiểm tra mối liên hệ giữa nhóm bộ môn và tỷ lệ chấn thương',
    recommendedMethod: 'Kiểm định Chi bình phương độc lập (Chi-square)',
    symbol: 'χ²',
    condition: 'Tần số kỳ vọng E >= 5'
  }
];
