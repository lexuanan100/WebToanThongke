export type QuizLevel = 'recognition' | 'comprehension' | 'application';

export interface QuizQuestion {
  id: number;
  level: QuizLevel;
  levelLabel: string;
  topicRef: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  calculationSteps?: string[];
  commonMistake?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- PHẦN I: 10 CÂU NHẬN BIẾT (Level 1) ---
  {
    id: 1,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 1: Khái niệm & Thang đo',
    question: 'Trong nghiên cứu Thể dục Thể thao, thang đo nào dưới đây có điểm 0 tuyệt đối và cho phép thực hiện đầy đủ các phép toán cộng, trừ, nhân, chia có ý nghĩa vật lý?',
    options: [
      { key: 'A', text: 'Thang đo Tỷ lệ (Ratio scale)' },
      { key: 'B', text: 'Thang đo Thứ bậc (Ordinal scale)' },
      { key: 'C', text: 'Thang đo Định danh (Nominal scale)' },
      { key: 'D', text: 'Thang đo Khoảng (Interval scale)' }
    ],
    correctAnswer: 'A',
    explanation: 'Thang đo tỷ lệ (như chiều cao cm, cân nặng kg, thời gian chạy giây, nhịp tim bpm) có điểm 0 tuyệt đối (0 giây nghĩa là không tốn thời gian). Khi đó vận động viên chạy 10 giây có tốc độ nhanh gấp đôi vận động viên chạy 20 giây.',
    commonMistake: 'Nhiều sinh viên nhầm thang đo khoảng (như nhiệt độ °C hay điểm T) có điểm 0 tuyệt đối, trong khi 0°C chỉ là mốc đóng băng quy ước.'
  },
  {
    id: 2,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 2: Thống kê mô tả',
    question: 'Chỉ số thống kê nào dưới đây được tính bằng tỷ lệ phần trăm giữa độ lệch chuẩn (S) và số trung bình (X̄), dùng để so sánh độ đồng đều giữa các bài test thể thao có đơn vị đo khác nhau?',
    options: [
      { key: 'A', text: 'Phương sai mẫu (S²)' },
      { key: 'B', text: 'Hệ số biến thiên (Cv)' },
      { key: 'C', text: 'Khoảng biến thiên (R)' },
      { key: 'D', text: 'Sai số chuẩn của số trung bình (SE)' }
    ],
    correctAnswer: 'B',
    explanation: 'Hệ số biến thiên Cv = (S / X̄) * 100% là đại lượng không thứ nguyên, cho phép so sánh độ phân tán giữa hai nội dung hoàn toàn khác biệt (ví dụ so sánh độ đồng đều của thành tích Chạy 100m đo bằng giây và Bật xa đo bằng cm).',
    commonMistake: 'Hay nhầm lẫn giữa Cv và SE (sai số chuẩn của số trung bình).'
  },
  {
    id: 3,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 3: Phân phối chuẩn & Điểm Z, T',
    question: 'Theo quy tắc thực nghiệm 68-95-99.7 của phân phối chuẩn Gauss, khoảng [X̄ - 2S ; X̄ + 2S] bao hàm xấp xỉ bao nhiêu phần trăm số sinh viên trong mẫu nghiên cứu?',
    options: [
      { key: 'A', text: '68.26%' },
      { key: 'B', text: '90.00%' },
      { key: 'C', text: '95.44%' },
      { key: 'D', text: '99.74%' }
    ],
    correctAnswer: 'C',
    explanation: 'Trong phân phối chuẩn: Khoảng ±1S chứa ~68.26% số liệu; Khoảng ±2S chứa ~95.44% số liệu; Khoảng ±3S chứa ~99.74% số liệu.',
    commonMistake: 'Nhầm lẫn giữa mốc 1S (68%), 2S (95.44%) và 3S (99.74%).'
  },
  {
    id: 4,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 5: Kiểm định giả thuyết',
    question: 'Trong kiểm định giả thuyết thống kê thể dục thể thao, sai lầm loại I (Type I error) xảy ra khi nào?',
    options: [
      { key: 'A', text: 'Không bác bỏ H0 khi H0 thực sự sai' },
      { key: 'B', text: 'Tính toán sai bậc tự do trong kiểm định t' },
      { key: 'C', text: 'Mẫu nghiên cứu không tuân theo phân phối chuẩn' },
      { key: 'D', text: 'Bác bỏ giả thuyết H0 trong khi H0 thực chất là đúng' }
    ],
    correctAnswer: 'D',
    explanation: 'Sai lầm loại I (xác suất ký hiệu là α) là sai lầm bác bỏ H0 khi H0 đúng (dương tính giả), tức là kết luận phương pháp huấn luyện mới có hiệu quả trong khi thực tế chỉ do may rủi ngẫu nhiên.',
    commonMistake: 'Rất nhiều người nhầm ngược với sai lầm loại II (chấp nhận H0 khi H0 sai).'
  },
  {
    id: 5,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 6: Kiểm định t-test',
    question: 'Khi muốn so sánh thành tích bật xa tại chỗ của cùng một nhóm 30 sinh viên tại hai thời điểm: trước khi tập tạ và sau 8 tuần tập tạ, phép kiểm định nào là phù hợp nhất?',
    options: [
      { key: 'A', text: 'Kiểm định t hai mẫu phụ thuộc ghép cặp (Paired samples t-test)' },
      { key: 'B', text: 'Kiểm định t hai mẫu độc lập (Independent samples t-test)' },
      { key: 'C', text: 'Kiểm định Chi bình phương độc lập (Chi-square)' },
      { key: 'D', text: 'Kiểm định t một mẫu (One-sample t-test)' }
    ],
    correctAnswer: 'A',
    explanation: 'Vì dữ liệu được đo lặp lại trên cùng một tập hợp đối tượng tại 2 thời điểm (trước - sau), các cặp số liệu có tính liên kết chặt chẽ nội cá thể, do đó bắt buộc phải sử dụng Paired samples t-test.',
    commonMistake: 'Chọn Independent t-test làm mất đi tính tương quan cá thể và làm giảm độ nhạy phát hiện hiệu quả tập luyện.'
  },
  {
    id: 6,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 7: Chi bình phương',
    question: 'Điều kiện tối thiểu về mặt tần số lý thuyết kỳ vọng (Expected frequency - E) để có thể áp dụng kiểm định Chi bình phương trong bảng tiếp liên 2x2 là gì?',
    options: [
      { key: 'A', text: 'Tất cả các ô quan sát thực tế O phải lớn hơn 30' },
      { key: 'B', text: 'Tổng số đối tượng điều tra phải từ 500 sinh viên trở lên' },
      { key: 'C', text: 'Độ lệch chuẩn của hai nhóm phải hoàn toàn bằng nhau' },
      { key: 'D', text: 'Tất cả các ô tần số kỳ vọng E phải đạt từ 5 trở lên (E >= 5)' }
    ],
    correctAnswer: 'D',
    explanation: 'Điều kiện chuẩn của kiểm định Chi bình phương là không có ô nào có tần số kỳ vọng E < 1 và không quá 20% số ô có E < 5 (đối với bảng 2x2 thì tất cả 4 ô kỳ vọng đều phải có E >= 5). Nếu vi phạm, phải dùng Fisher’s Exact Test.',
    commonMistake: 'Nhầm lẫn giữa tần số quan sát thực tế O và tần số lý thuyết kỳ vọng E.'
  },
  {
    id: 7,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 8: Phân tích phương sai ANOVA',
    question: 'Tại sao khi so sánh thành tích thể lực giữa 4 nhóm sinh viên tập 4 bài tập khác nhau, ta không nên thực hiện 6 phép kiểm định t độc lập từng đôi một?',
    options: [
      { key: 'A', text: 'Vì phép kiểm định t không tính được bậc tự do cho 4 nhóm' },
      { key: 'B', text: 'Vì số trung bình của 4 nhóm luôn có phân phối chuẩn' },
      { key: 'C', text: 'Vì sẽ làm tăng vọt nguy cơ mắc sai lầm loại I tích lũy (lạm phát alpha)' },
      { key: 'D', text: 'Vì các nhóm thể thao không bao giờ có phương sai đồng nhất' }
    ],
    correctAnswer: 'C',
    explanation: 'Nếu làm 6 phép kiểm định t ở mức α = 0.05, xác suất ít nhất một phép thử bị sai lầm loại I là 1 - (1 - 0.05)^6 ≈ 26.5% (thay vì 5%). ANOVA kiểm soát sai lầm này ở đúng 5%.',
    commonMistake: 'Nghĩ rằng làm nhiều t-test vẫn cho mức ý nghĩa 5% như khi làm một lần.'
  },
  {
    id: 8,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 9: Tương quan & Hồi quy',
    question: 'Hệ số tương quan tuyến tính Pearson (r) nhận giá trị trong khoảng nào sau đây?',
    options: [
      { key: 'A', text: 'Từ 0 đến +1' },
      { key: 'B', text: 'Từ 0 đến vô cùng' },
      { key: 'C', text: 'Từ - vô cùng đến + vô cùng' },
      { key: 'D', text: 'Từ -1 đến +1' }
    ],
    correctAnswer: 'D',
    explanation: 'Hệ số tương quan Pearson luôn nằm trong đoạn [-1; +1]. Dấu (+) biểu thị tương quan thuận, dấu (-) biểu thị tương quan nghịch, độ lớn phản ánh độ chặt chẽ.',
    commonMistake: 'Nhầm với hệ số xác định R² (chỉ nhận giá trị từ 0 đến 1).'
  },
  {
    id: 9,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 10: Đánh giá Test TDTT',
    question: 'Trong kiểm định đo lường thể thao, một bài test thể lực được coi là có "Độ tin cậy" (Reliability) tốt khi hệ số tương quan test-retest (r_tt) đạt ngưỡng tối thiểu nào?',
    options: [
      { key: 'A', text: 'r_tt >= 0.85' },
      { key: 'B', text: 'r_tt >= 0.30' },
      { key: 'C', text: 'r_tt >= 0.50' },
      { key: 'D', text: 'r_tt = 1.00 tuyệt đối' }
    ],
    correctAnswer: 'A',
    explanation: 'Theo chuẩn đo lường TDTT (Baumgartner & Jackson), các bài test thể lực cần đạt hệ số tương quan kiểm tra - kiểm tra lại r_tt >= 0.85 (thậm chí >= 0.90 với các chỉ số nhân trắc) mới được coi là tin cậy để đưa vào đánh giá sinh viên.',
    commonMistake: 'Nghĩ rằng r > 0.50 đã đủ làm bài thi thể thao chính thức.'
  },
  {
    id: 10,
    level: 'recognition',
    levelLabel: 'Nhận biết',
    topicRef: 'Chủ đề 3: Phân phối chuẩn & Điểm Z, T',
    question: 'Điểm tiêu chuẩn T (T-score) được quy đổi từ điểm chuẩn Z theo công thức nào dưới đây?',
    options: [
      { key: 'A', text: 'T = 100 + 15 * Z' },
      { key: 'B', text: 'T = 50 + 10 * Z' },
      { key: 'C', text: 'T = Z * 10' },
      { key: 'D', text: 'T = 50 - 10 * Z' }
    ],
    correctAnswer: 'B',
    explanation: 'Điểm T được định nghĩa là T = 50 + 10Z, có giá trị trung bình là 50 và độ lệch chuẩn là 10, giúp điểm số luôn dương và dễ đọc.',
    commonMistake: 'Nhầm với chỉ số IQ Wechsler (100 + 15Z).'
  },

  // --- PHẦN II: 10 CÂU THÔNG HIỂU (Level 2) ---
  {
    id: 11,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 2: Thống kê mô tả',
    question: 'Khi phân tích thời gian chạy 1500m của một lớp 40 sinh viên, giảng viên nhận thấy có 2 sinh viên bị chấn thương đi bộ nên mất tới 18 phút (trong khi cả lớp chạy 5-7 phút). Tham số nào phản ánh trung thực nhất mức độ chạy trung bình của đa số sinh viên trong lớp?',
    options: [
      { key: 'A', text: 'Số trung bình cộng (Mean)' },
      { key: 'B', text: 'Khoảng biến thiên (Range)' },
      { key: 'C', text: 'Trung vị (Median)' },
      { key: 'D', text: 'Độ lệch chuẩn (Standard Deviation)' }
    ],
    correctAnswer: 'C',
    explanation: 'Số trung bình cộng (Mean) rất nhạy cảm và bị kéo lệch mạnh bởi các giá trị ngoại lai (outliers cực lớn). Trung vị (Median) là giá trị đứng ở vị trí 50% sau khi xếp thứ tự nên không bị ảnh hưởng bởi 2 giá trị 18 phút này.',
    commonMistake: 'Thói quen luôn luôn chọn Mean trong mọi tình huống.'
  },
  {
    id: 12,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 5: Kiểm định giả thuyết',
    question: 'Một huấn luyện viên so sánh hiệu quả của phương pháp ép dẻo mới và phương pháp truyền thống, kết quả kiểm định t cho giá trị p = 0.082 với mức ý nghĩa chọn trước α = 0.05. Kết luận sư phạm nào sau đây là chính xác?',
    options: [
      { key: 'A', text: 'Phương pháp mới làm giảm độ dẻo của vận động viên' },
      { key: 'B', text: 'Phương pháp mới vượt trội hơn có ý nghĩa thống kê' },
      { key: 'C', text: 'Chưa đủ bằng chứng thống kê ở độ tin cậy 95% để khẳng định phương pháp mới hiệu quả hơn phương pháp cũ' },
      { key: 'D', text: 'Chắc chắn hai phương pháp mang lại hiệu quả hoàn toàn giống nhau 100%' }
    ],
    correctAnswer: 'C',
    explanation: 'Vì p = 0.082 > α = 0.05, ta chưa đủ cơ sở thống kê để bác bỏ H0. Khác biệt quan sát được có 8.2% khả năng chỉ do ngẫu nhiên, lớn hơn ngưỡng rủi ro 5% chấp nhận.',
    commonMistake: 'Tự ý kết luận phương pháp mới tốt hơn chỉ vì thấy trung bình mẫu nhỉnh hơn một chút dù p > 0.05.'
  },
  {
    id: 13,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 2: Hệ số biến thiên Cv',
    question: 'Đo thành tích bật xa của lớp A có Cv = 6.5%, lớp B có Cv = 18.2%. Nhận định nào sau đây là đúng về đặc điểm thể lực của hai lớp?',
    options: [
      { key: 'A', text: 'Lớp A có thành tích bật xa trung bình cao hơn lớp B' },
      { key: 'B', text: 'Lớp B có số lượng sinh viên nhiều hơn lớp A' },
      { key: 'C', text: 'Lớp A có độ lệch chuẩn lớn hơn lớp B' },
      { key: 'D', text: 'Lớp B có sự phân tán thành tích lớn hơn, trình độ thể lực sức bật không đồng đều bằng lớp A' }
    ],
    correctAnswer: 'D',
    explanation: 'Hệ số biến thiên Cv phản ánh độ đồng đều. Cv lớp A = 6.5% (< 10%) cho thấy lớp A rất đồng đều. Lớp B có Cv = 18.2% chứng tỏ thành tích sinh viên lớp B phân tán mạnh, chênh lệch giữa sinh viên giỏi và yếu khá lớn.',
    commonMistake: 'Nghĩ rằng Cv cao thì thành tích trung bình cao hơn.'
  },
  {
    id: 14,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 9: Tương quan & Nhân quả',
    question: 'Nghiên cứu trên 200 cầu thủ bóng đá ghi nhận hệ số tương quan giữa Chiều dài cẳng chân (cm) và Tốc độ sút bóng (km/h) là r = +0.78 (p < 0.001). Kết luận nào sau đây thể hiện đúng tư duy nghiên cứu khoa học TDTT?',
    options: [
      { key: 'A', text: 'Chiều dài cẳng chân và tốc độ sút bóng có mối quan hệ tương quan thuận chặt chẽ, nhưng không thể kết luận đơn phương rằng chân dài là nguyên nhân duy nhất tạo ra lực sút mạnh' },
      { key: 'B', text: 'Chiều dài chân là nguyên nhân trực tiếp quyết định 100% tốc độ sút bóng' },
      { key: 'C', text: 'Nếu phẫu thuật kéo dài chân thêm 5cm thì tốc độ sút bóng chắc chắn tăng tương ứng' },
      { key: 'D', text: 'Không có bất kỳ mối liên hệ nào giữa hai chỉ số này' }
    ],
    correctAnswer: 'A',
    explanation: 'Tương quan không đồng nghĩa với Nhân quả (Correlation ≠ Causation). r = 0.78 chỉ ra mối quan hệ đồng biến mạnh mẽ, nhưng lực sút bóng còn phụ thuộc vào kỹ thuật tiếp xúc bóng, sức mạnh cơ tứ đầu đùi, độ mềm dẻo khớp háng...',
    commonMistake: 'Đồng nhất hệ số tương quan cao với quan hệ nhân quả tuyệt đối.'
  },
  {
    id: 15,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 4: Sai số chuẩn SE',
    question: 'Nếu một nhà nghiên cứu muốn giảm sai số chuẩn của số trung bình (SE) đi một nửa (giảm 50%) để tăng độ chính xác ước lượng thể lực sinh viên, nhà nghiên cứu cần phải làm gì với cỡ mẫu n?',
    options: [
      { key: 'A', text: 'Tăng cỡ mẫu n lên gấp 2 lần' },
      { key: 'B', text: 'Tăng cỡ mẫu n lên gấp 4 lần' },
      { key: 'C', text: 'Giảm cỡ mẫu n đi 2 lần' },
      { key: 'D', text: 'Tăng cỡ mẫu n lên gấp 16 lần' }
    ],
    correctAnswer: 'B',
    explanation: 'Công thức SE = S / √n. Để SE giảm đi 2 lần (SE_moi = SE / 2), mẫu số √n phải tăng lên 2 lần: √(n_moi) = 2√n <=> n_moi = 4n. Như vậy cần tăng cỡ mẫu lên gấp 4 lần.',
    commonMistake: 'Cho rằng muốn giảm sai số 2 lần thì chỉ cần tăng cỡ mẫu 2 lần.'
  },
  {
    id: 16,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 8: ANOVA Post-Hoc',
    question: 'Khi chạy ANOVA một yếu tố để so sánh sức bền của 3 nhóm sinh viên tập 3 môn thể thao, kết quả cho F = 1.85 với p = 0.174. Bước tiếp theo người nghiên cứu nên làm gì?',
    options: [
      { key: 'A', text: 'Chạy ngay kiểm định hậu nghiệm Tukey HSD để tìm nhóm xuất sắc nhất' },
      { key: 'B', text: 'Chạy thêm 3 phép kiểm định t độc lập' },
      { key: 'C', text: 'Dừng phân tích, kết luận chưa có sự khác biệt có ý nghĩa thống kê giữa 3 nhóm môn' },
      { key: 'D', text: 'Loại bỏ bớt dữ liệu của nhóm có thành tích thấp nhất' }
    ],
    correctAnswer: 'C',
    explanation: 'Vì kiểm định tổng thể ANOVA không có ý nghĩa thống kê (p = 0.174 > 0.05), không được phép chạy tiếp các phép so sánh cặp Post-Hoc (như Tukey HSD). Ta kết luận sự chênh lệch giữa 3 nhóm chưa có ý nghĩa thống kê.',
    commonMistake: 'Vẫn cố chạy Post-Hoc khi F không có ý nghĩa để "tìm kiếm" sự khác biệt.'
  },
  {
    id: 17,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 6: Cỡ ảnh hưởng Cohen d',
    question: 'Một nghiên cứu đánh giá bài tập bật cóc đối với sức bật của 1000 sinh viên cho thấy thành tích tăng trung bình 0.5 cm với p = 0.002 (p < 0.05), nhưng tính được cỡ ảnh hưởng Cohen’s d = 0.08. Ý nghĩa thực tế của kết quả này là gì?',
    options: [
      { key: 'A', text: 'Bài tập bật cóc có hiệu quả huấn luyện thực tế vô cùng lớn' },
      { key: 'B', text: 'Độ tin cậy của phép đo đạt 99.8%' },
      { key: 'C', text: 'Sinh viên đã giảm thể lực sau khi tập' },
      { key: 'D', text: 'Kết quả có ý nghĩa thống kê (do mẫu quá lớn) nhưng mức độ cải thiện thực tế là quá nhỏ, không đáng kể trong huấn luyện thể lực' }
    ],
    correctAnswer: 'D',
    explanation: 'Với cỡ mẫu rất lớn (n = 1000), ngay cả độ chênh lệch cực nhỏ (0.5cm) cũng dễ dàng đạt p < 0.05. Tuy nhiên Cohen d = 0.08 (< 0.2) chứng minh hiệu ứng thực tế là vô cùng nhỏ, không tạo ra bước nhảy vọt thể lực thực thụ.',
    commonMistake: 'Chỉ nhìn vào p < 0.05 mà khẳng định bài tập mang lại bước tiến vượt bậc.'
  },
  {
    id: 18,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 10: Độ giá trị của Test',
    question: 'Một giảng viên muốn đo Sức mạnh tốc độ của sinh viên nhưng lại dùng bài test "Chạy 3000m tính thời gian". Bài test này vi phạm tiêu chuẩn nào trong đo lường TDTT?',
    options: [
      { key: 'A', text: 'Độ tin cậy (Reliability)' },
      { key: 'B', text: 'Tính khách quan của người đo (Objectivity)' },
      { key: 'C', text: 'Tính kinh tế của bài kiểm tra' },
      { key: 'D', text: 'Độ giá trị / Tính thông báo (Validity)' }
    ],
    correctAnswer: 'D',
    explanation: 'Độ giá trị (Validity) đòi hỏi bài test phải đo đúng cái mà nó dự định đo. Bài chạy 3000m đo Sức bền hiếu khí chứ không thể đo Sức mạnh tốc độ. Do đó test này hoàn toàn thiếu độ giá trị đối với tố chất tốc độ.',
    commonMistake: 'Nhầm lẫn giữa Độ tin cậy (đo ổn định qua các lần) và Độ giá trị (đo đúng tố chất cần đo).'
  },
  {
    id: 19,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 11: Thiết kế thử nghiệm sư phạm',
    question: 'Trước khi bắt đầu thực nghiệm sư phạm so sánh 2 giáo án thể lực cho Nhóm thực nghiệm và Nhóm đối chứng, điều kiện tiên quyết bắt buộc phải kiểm tra là gì?',
    options: [
      { key: 'A', text: 'Phải kiểm tra t-test độc lập giữa 2 nhóm về thành tích ban đầu và yêu cầu p > 0.05 để đảm bảo 2 nhóm tương đương nhau về trình độ ban đầu' },
      { key: 'B', text: 'Phải đảm bảo Nhóm thực nghiệm có thành tích ban đầu cao hơn Nhóm đối chứng' },
      { key: 'C', text: 'Phải chọn mẫu ít nhất 500 sinh viên mỗi nhóm' },
      { key: 'D', text: 'Không cần kiểm tra vì sau khi bốc thăm ngẫu nhiên 2 nhóm mặc nhiên bằng nhau' }
    ],
    correctAnswer: 'A',
    explanation: 'Để kết luận tiến bộ sau này là do giáo án mới, hai nhóm ban đầu phải có cùng mặt bằng thể lực (t-test cho p > 0.05). Nếu ban đầu đã chênh lệch thì kết quả cuối cùng không còn giá trị khoa học.',
    commonMistake: 'Bỏ qua bước kiểm tra tương đương đầu vào, dẫn đến thiên lệch chọn mẫu.'
  },
  {
    id: 20,
    level: 'comprehension',
    levelLabel: 'Thông hiểu',
    topicRef: 'Chủ đề 3: Chuẩn hóa chỉ số nghịch tính',
    question: 'Khi tính điểm tiêu chuẩn Z cho môn Chạy 100m (chỉ số mà thời gian càng nhỏ thành tích càng tốt), công thức chuẩn hóa nào là đúng để sinh viên chạy nhanh hơn có điểm Z cao hơn?',
    options: [
      { key: 'A', text: 'Z = (X - X̄) / S' },
      { key: 'B', text: 'Z = (X̄ - X) / S' },
      { key: 'C', text: 'Z = (X - X̄) * S' },
      { key: 'D', text: 'Z = X̄ / (X * S)' }
    ],
    correctAnswer: 'B',
    explanation: 'Đối với các chỉ số nghịch tính (thời gian chạy cự ly, thời gian bơi), thành tích tốt hơn nghĩa là X < X̄. Để điểm Z dương thể hiện thành tích xuất sắc, ta phải dùng Z = (X̄ - X) / S.',
    commonMistake: 'Dùng máy móc Z = (X - X̄)/S khiến người chạy kỷ lục lại bị điểm Z âm nặng.'
  },

  // --- PHẦN III: 10 CÂU VẬN DỤNG CÓ TÍNH TOÁN (Level 3) ---
  {
    id: 21,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 2: Tính X̄ và S',
    question: 'Đo thành tích Bật xa tại chỗ (cm) của 5 sinh viên thu được các số liệu: 200, 210, 220, 230, 240. Số trung bình (X̄) và độ lệch chuẩn mẫu hiệu chỉnh (S) lần lượt là:',
    options: [
      { key: 'A', text: 'X̄ = 220 cm; S = 20.00 cm' },
      { key: 'B', text: 'X̄ = 215 cm; S = 14.14 cm' },
      { key: 'C', text: 'X̄ = 220 cm; S = 15.81 cm' },
      { key: 'D', text: 'X̄ = 220 cm; S = 250.0 cm' }
    ],
    correctAnswer: 'C',
    explanation: 'Các bước tính toán:\n1. Trung bình X̄ = (200 + 210 + 220 + 230 + 240) / 5 = 1100 / 5 = 220 cm.\n2. Bình phương sai lệch: (200-220)² + (210-220)² + (220-220)² + (230-220)² + (240-220)² = 400 + 100 + 0 + 100 + 400 = 1000.\n3. Phương sai mẫu S² = 1000 / (5 - 1) = 1000 / 4 = 250 cm².\n4. Độ lệch chuẩn S = √250 ≈ 15.81 cm.',
    calculationSteps: [
      'X̄ = 1100 / 5 = 220 cm',
      'SS = (-20)² + (-10)² + 0² + 10² + 20² = 400 + 100 + 0 + 100 + 400 = 1000',
      'S² = 1000 / (n - 1) = 1000 / 4 = 250',
      'S = √250 ≈ 15.81 cm'
    ],
    commonMistake: 'Chia cho n = 5 ra S = √200 ≈ 14.14 cm (sai vì không dùng n - 1).'
  },
  {
    id: 22,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 2: Hệ số biến thiên Cv',
    question: 'Một nhóm 25 sinh viên nam có thành tích chạy 100m trung bình là X̄ = 14.0 giây và độ lệch chuẩn S = 0.7 giây. Hệ số biến thiên Cv của nhóm là bao nhiêu và nhóm này thuộc mức độ đồng đều nào?',
    options: [
      { key: 'A', text: 'Cv = 2.0%; Mức độ phân tán cao' },
      { key: 'B', text: 'Cv = 10.0%; Mức độ trung bình' },
      { key: 'C', text: 'Cv = 5.0%; Mức độ rất đồng đều' },
      { key: 'D', text: 'Cv = 7.0%; Mức độ không đồng đều' }
    ],
    correctAnswer: 'C',
    explanation: 'Tính toán: Cv = (S / X̄) * 100% = (0.7 / 14.0) * 100% = 0.05 * 100% = 5.0%. Theo thang đánh giá thể thao: Cv < 10% là nhóm có thành tích rất đồng đều.',
    calculationSteps: [
      'Cv = (0.7 / 14.0) * 100% = 5.0%',
      'Cv = 5.0% < 10% => Mức độ rất đồng đều'
    ],
    commonMistake: 'Lấy X̄ chia S (14 / 0.7 = 20) hoặc nhầm lẫn thang đánh giá Cv.'
  },
  {
    id: 23,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 3: Điểm Z và Điểm T',
    question: 'Toàn khóa sinh viên có thành tích Chống đẩy trung bình X̄ = 30 lần, độ lệch chuẩn S = 5 lần. Sinh viên Nam thực hiện được 42 lần chống đẩy. Điểm chuẩn Z và điểm tiêu chuẩn T của sinh viên Nam lần lượt là:',
    options: [
      { key: 'A', text: 'Z = +2.4; T = 74 điểm' },
      { key: 'B', text: 'Z = +1.2; T = 62 điểm' },
      { key: 'C', text: 'Z = -2.4; T = 26 điểm' },
      { key: 'D', text: 'Z = +2.4; T = 52.4 điểm' }
    ],
    correctAnswer: 'A',
    explanation: 'Các bước tính toán:\n1. Vì chống đẩy là chỉ số thuận tính (càng nhiều càng tốt): Z = (X - X̄) / S = (42 - 30) / 5 = 12 / 5 = +2.4.\n2. Điểm T = 50 + 10 * Z = 50 + 10 * 2.4 = 50 + 24 = 74 điểm.',
    calculationSteps: [
      'Z = (42 - 30) / 5 = +2.4',
      'T = 50 + 10 * 2.4 = 74'
    ],
    commonMistake: 'Lấy T = 50 + Z = 52.4 hoặc tính sai Z âm.'
  },
  {
    id: 24,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 4: Sai số chuẩn & Khoảng tin cậy',
    question: 'Đo nhịp tim lúc nghỉ của mẫu 64 sinh viên thu được X̄ = 70.0 lần/phút, S = 8.0 lần/phút. Với mức ý nghĩa α = 0.05 (Z = 1.96), khoảng tin cậy 95% cho nhịp tim trung bình của tổng thể sinh viên là:',
    options: [
      { key: 'A', text: '[68.04 ; 71.96] lần/phút' },
      { key: 'B', text: '[62.00 ; 78.00] lần/phút' },
      { key: 'C', text: '[69.51 ; 70.49] lần/phút' },
      { key: 'D', text: '[60.20 ; 79.80] lần/phút' }
    ],
    correctAnswer: 'A',
    explanation: 'Các bước tính toán:\n1. Sai số chuẩn SE = S / √n = 8.0 / √64 = 8.0 / 8 = 1.0 lần/phút.\n2. Sai số biên e = 1.96 * SE = 1.96 * 1.0 = 1.96.\n3. Khoảng tin cậy 95% = [70.0 - 1.96 ; 70.0 + 1.96] = [68.04 ; 71.96] lần/phút.',
    calculationSteps: [
      'SE = 8.0 / √64 = 1.0 bpm',
      'e = 1.96 * 1.0 = 1.96 bpm',
      'CI95 = [70 - 1.96 ; 70 + 1.96] = [68.04 ; 71.96]'
    ],
    commonMistake: 'Lấy trực tiếp S thay vì SE: 70 ± 1.96*8.0 = [54.3 ; 85.7] hoặc nhầm √64 = 16.'
  },
  {
    id: 25,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 6: Paired t-test tính tay',
    question: 'Đo thành tích Gập bụng (lần/phút) của 4 sinh viên trước tập: [20, 22, 25, 21] và sau khóa tập: [24, 25, 29, 26]. Độ chênh lệch D = Sau - Trước. Giá trị thống kê kiểm định t thực nghiệm tính được là:',
    options: [
      { key: 'A', text: 't = 2.45' },
      { key: 'B', text: 't = 4.00' },
      { key: 'C', text: 't = 5.00' },
      { key: 'D', text: 't = 9.80' }
    ],
    correctAnswer: 'D',
    explanation: 'Các bước tính toán:\n1. Dãy chênh lệch D = [24-20, 25-22, 29-25, 26-21] = [4, 3, 4, 5].\n2. Chênh lệch trung bình D̄ = (4 + 3 + 4 + 5) / 4 = 16 / 4 = 4.0 lần.\n3. Độ lệch chuẩn SD: SS = (4-4)² + (3-4)² + (4-4)² + (5-4)² = 0 + 1 + 0 + 1 = 2. SD² = 2 / (4 - 1) = 2/3 ≈ 0.667. SD = √(2/3) ≈ 0.8165.\n4. Sai số chuẩn của hiệu SE_D = SD / √n = 0.8165 / √4 = 0.8165 / 2 ≈ 0.4082.\n5. Trị số t = D̄ / SE_D = 4.0 / 0.4082 ≈ 9.80.',
    calculationSteps: [
      'D = [4, 3, 4, 5], D̄ = 4.0',
      'SD² = [0 + 1 + 0 + 1] / 3 = 0.667 => SD ≈ 0.8165',
      'SE_D = 0.8165 / 2 = 0.4082',
      't = 4.0 / 0.4082 ≈ 9.80'
    ],
    commonMistake: 'Quên chia cho √n ở mẫu số, tính ra t = D̄ / SD = 4.0 / 0.8165 ≈ 4.90.'
  },
  {
    id: 26,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 6: Cỡ ảnh hưởng Cohen d',
    question: 'Sau khóa tập huấn, chênh lệch thành tích trung bình của nhóm là D̄ = 6.0 cm với độ lệch chuẩn của độ chênh lệch là SD = 5.0 cm. Cỡ ảnh hưởng Cohen’s d bằng bao nhiêu và thuộc mức độ nào?',
    options: [
      { key: 'A', text: 'd = 0.83; Mức độ trung bình' },
      { key: 'B', text: 'd = 1.20; Mức độ lớn (Large effect)' },
      { key: 'C', text: 'd = 0.30; Mức độ nhỏ' },
      { key: 'D', text: 'd = 30.0; Mức độ cực lớn' }
    ],
    correctAnswer: 'B',
    explanation: 'Công thức Cohen’s d ghép cặp: d = D̄ / SD = 6.0 / 5.0 = 1.20. Theo quy ước Cohen: d >= 0.8 được xem là cỡ ảnh hưởng lớn (Large effect). Hiệu quả cải thiện thể lực ở đây là rất rõ nét.',
    calculationSteps: [
      'd = 6.0 / 5.0 = 1.20',
      '1.20 >= 0.8 => Mức độ lớn'
    ],
    commonMistake: 'Lấy nghịch đảo 5.0 / 6.0 = 0.83.'
  },
  {
    id: 27,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 8: ANOVA tính F',
    question: 'Một bài toán phân tích phương sai ANOVA so sánh 3 nhóm phương pháp tập luyện (mỗi nhóm có 6 sinh viên, tổng N = 18). Tính được SS_between = 50 và SS_within = 60. Giá trị kiểm định F thực nghiệm bằng bao nhiêu?',
    options: [
      { key: 'A', text: 'F = 0.83' },
      { key: 'B', text: 'F = 6.25' },
      { key: 'C', text: 'F = 12.50' },
      { key: 'D', text: 'F = 3.125' }
    ],
    correctAnswer: 'B',
    explanation: 'Các bước tính toán:\n1. Bậc tự do giữa các nhóm: df_between = k - 1 = 3 - 1 = 2.\n2. Bậc tự do trong nội bộ nhóm: df_within = N - k = 18 - 3 = 15.\n3. Trung bình bình phương giữa các nhóm: MS_between = SS_between / df_between = 50 / 2 = 25.0.\n4. Trung bình bình phương nội bộ: MS_within = SS_within / df_within = 60 / 15 = 4.0.\n5. Tiêu chuẩn Fisher F = MS_between / MS_within = 25.0 / 4.0 = 6.25.',
    calculationSteps: [
      'df1 = 3 - 1 = 2; df2 = 18 - 3 = 15',
      'MS_between = 50 / 2 = 25.0',
      'MS_within = 60 / 15 = 4.0',
      'F = 25.0 / 4.0 = 6.25'
    ],
    commonMistake: 'Lấy trực tiếp SS chia cho nhau: 50 / 60 = 0.83 mà không chia cho bậc tự do df.'
  },
  {
    id: 28,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 9: Hồi quy tuyến tính dự báo',
    question: 'Phương trình hồi quy giữa Sức mạnh cơ bắp tay (X, kg) và Thành tích Đẩy tạ (Y, mét) được xác định là: Y = 0.12 * X + 4.5. Nếu một vận động viên rèn luyện nâng lực tay lên mức X = 60 kg thì thành tích đẩy tạ dự báo đạt được là:',
    options: [
      { key: 'A', text: '11.70 mét' },
      { key: 'B', text: '7.20 mét' },
      { key: 'C', text: '12.50 mét' },
      { key: 'D', text: '9.50 mét' }
    ],
    correctAnswer: 'A',
    explanation: 'Thay X = 60 vào phương trình hồi quy:\nY = 0.12 * 60 + 4.5 = 7.2 + 4.5 = 11.70 mét.',
    calculationSteps: [
      'Y = 0.12 * 60 + 4.5',
      'Y = 7.2 + 4.5 = 11.70 m'
    ],
    commonMistake: 'Quên cộng hệ số tự do 4.5, chỉ tính 0.12 * 60 = 7.20 m.'
  },
  {
    id: 29,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 7: Chi bình phương tính E',
    question: 'Khảo sát 200 vận động viên (gồm 120 Nam và 80 Nữ). Toàn bộ khảo sát ghi nhận có 50 người từng bị chấn thương dây chằng chéo. Nếu giới tính và chấn thương độc lập với nhau, tần số lý thuyết kỳ vọng (E) số VĐV Nam bị chấn thương là bao nhiêu?',
    options: [
      { key: 'A', text: 'E = 20 người' },
      { key: 'B', text: 'E = 25 người' },
      { key: 'C', text: 'E = 30 người' },
      { key: 'D', text: 'E = 48 người' }
    ],
    correctAnswer: 'C',
    explanation: 'Công thức tần số kỳ vọng: E = (Tổng hàng * Tổng cột) / Tổng chung N.\nỞ đây: Hàng Nam = 120, Cột Chấn thương = 50, Tổng N = 200.\nE = (120 * 50) / 200 = 6000 / 200 = 30 người.',
    calculationSteps: [
      'E = (Tổng Nam * Tổng Chấn thương) / N',
      'E = (120 * 50) / 200 = 30'
    ],
    commonMistake: 'Lấy 50 / 2 = 25 người (chia đều nam nữ mà quên tỷ lệ nam 120/200 = 60%).'
  },
  {
    id: 30,
    level: 'application',
    levelLabel: 'Vận dụng tính toán',
    topicRef: 'Chủ đề 11: Nhịp tăng trưởng Brody W%',
    question: 'Thành tích chạy 60m của một sinh viên đầu năm là V1 = 9.20 giây, sau 1 năm tập luyện thành tích rút xuống còn V2 = 8.80 giây. Theo công thức Brody, nhịp tăng trưởng thành tích (W%) đạt bao nhiêu?',
    options: [
      { key: 'A', text: 'W = 2.22%' },
      { key: 'B', text: 'W = 4.44%' },
      { key: 'C', text: 'W = 4.35%' },
      { key: 'D', text: 'W = 8.88%' }
    ],
    correctAnswer: 'B',
    explanation: 'Chạy là chỉ số nghịch tính nên lượng tiến bộ tuyệt đối là |8.80 - 9.20| = 0.40 giây.\nThành tích trung bình giữa 2 thời điểm: (9.20 + 8.80) / 2 = 9.00 giây.\nCông thức Brody: W = [ (V1 - V2) / (0.5 * (V1 + V2)) ] * 100% = [ 0.40 / 9.00 ] * 100% ≈ 4.44%.',
    calculationSteps: [
      'Hiệu số cải thiện = 9.20 - 8.80 = 0.40s',
      'Trung bình 2 lần đo = (9.20 + 8.80) / 2 = 9.00s',
      'W% = (0.40 / 9.00) * 100% ≈ 4.44%'
    ],
    commonMistake: 'Chia trực tiếp cho thành tích ban đầu 9.20 (0.40 / 9.20 = 4.35%) thay vì chia cho trung bình cộng 9.00 theo công thức Brody.'
  }
];
