import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Dumbbell,
  FileCheck2,
  FileQuestion,
  GraduationCap,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Table,
  Target,
  Trophy,
  X,
  XCircle
} from 'lucide-react';
import { THEORY_TOPICS, STATISTICAL_DECISION_TABLE, TheoryTopic } from '../data/theoryData';
import { QUIZ_QUESTIONS, QuizQuestion, QuizLevel } from '../data/quizData';

export const TheoryAndQuizView: React.FC = () => {
  // Main sub-tabs: 'theory' | 'decision-table' | 'quiz' | 'answer-key'
  const [subTab, setSubTab] = useState<'theory' | 'decision-table' | 'quiz' | 'answer-key'>('theory');

  // Theory state
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-1');
  const [theorySearch, setTheorySearch] = useState<string>('');

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [activeLevelFilter, setActiveLevelFilter] = useState<'all' | QuizLevel | 'wrong'>('all');
  const [instantExplainMode, setInstantExplainMode] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer effect
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  // Format time mm:ss
  const formattedTime = useMemo(() => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timerSeconds]);

  // Filter topics
  const filteredTopics = useMemo(() => {
    if (!theorySearch.trim()) return THEORY_TOPICS;
    const q = theorySearch.toLowerCase();
    return THEORY_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.concepts.some((c) => c.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    );
  }, [theorySearch]);

  const activeTopic = useMemo(() => {
    return THEORY_TOPICS.find((t) => t.id === selectedTopicId) || THEORY_TOPICS[0];
  }, [selectedTopicId]);

  // Quiz calculations
  const totalAnswered = Object.keys(userAnswers).length;
  const scoreDetails = useMemo(() => {
    let correctCount = 0;
    let wrongCount = 0;
    const wrongQuestionIds: number[] = [];

    QUIZ_QUESTIONS.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans) {
        if (ans === q.correctAnswer) {
          correctCount++;
        } else {
          wrongCount++;
          wrongQuestionIds.push(q.id);
        }
      }
    });

    const scoreOutOf10 = (correctCount / QUIZ_QUESTIONS.length) * 10;

    return {
      correctCount,
      wrongCount,
      unanswered: QUIZ_QUESTIONS.length - totalAnswered,
      scoreOutOf10: Number(scoreOutOf10.toFixed(2)),
      percentage: Math.round((correctCount / QUIZ_QUESTIONS.length) * 100),
      wrongQuestionIds
    };
  }, [userAnswers, totalAnswered]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      if (activeLevelFilter === 'all') return true;
      if (activeLevelFilter === 'wrong') {
        return scoreDetails.wrongQuestionIds.includes(q.id);
      }
      return q.level === activeLevelFilter;
    });
  }, [activeLevelFilter, scoreDetails.wrongQuestionIds]);

  const handleSelectOption = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setActiveLevelFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <GraduationCap className="w-96 h-96 -mr-16" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <GraduationCap className="w-3.5 h-3.5 text-blue-200" />
            <span>Tài liệu ôn tập & Khảo thí Thể dục Thể thao</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Toán Thống Kê Trong Thể Dục Thể Thao
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Hệ thống hóa toàn diện 11 chủ đề lý thuyết trọng tâm kèm công thức, ví dụ thể thao tính toán từng bước, bảng ma trận chọn phương pháp và bộ 30 câu trắc nghiệm tương tác có chấm điểm chuẩn kỳ thi kết thúc học phần.
          </p>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => setSubTab('theory')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                subTab === 'theory'
                  ? 'bg-white text-blue-900 shadow-lg ring-2 ring-white/50'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>11 Chủ đề Lý thuyết</span>
            </button>

            <button
              onClick={() => setSubTab('decision-table')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                subTab === 'decision-table'
                  ? 'bg-white text-blue-900 shadow-lg ring-2 ring-white/50'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Khi nào dùng phương pháp nào?</span>
            </button>

            <button
              onClick={() => setSubTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                subTab === 'quiz'
                  ? 'bg-amber-400 text-slate-950 shadow-lg ring-2 ring-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              <span>30 Câu Trắc nghiệm thi thử</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-extrabold ml-1">
                Hot
              </span>
            </button>

            <button
              onClick={() => setSubTab('answer-key')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                subTab === 'answer-key'
                  ? 'bg-white text-blue-900 shadow-lg ring-2 ring-white/50'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Bảng tra đáp án 30 câu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. TAB: 11 CHỦ ĐỀ LÝ THUYẾT TRỌNG TÂM                     */}
      {/* ========================================================= */}
      {subTab === 'theory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Topics list */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mục lục ôn tập (11 Chủ đề)
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                Đầy đủ
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={theorySearch}
                onChange={(e) => setTheorySearch(e.target.value)}
                placeholder="Tìm chủ đề, công thức, khái niệm..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 bg-slate-50/70"
              />
              {theorySearch && (
                <button
                  onClick={() => setTheorySearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Topics button list */}
            <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredTopics.map((topic) => {
                const isSelected = topic.id === selectedTopicId;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-300 text-blue-950 shadow-xs'
                        : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {topic.topicNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-tight line-clamp-2">
                        {topic.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {topic.category}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content: Active Topic Details */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            {/* Topic Header */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                  Chủ đề {activeTopic.topicNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                  {activeTopic.category}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {activeTopic.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeTopic.subtitle}
              </p>
            </div>

            {/* 1. Khái niệm cốt lõi */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>1. Khái niệm cốt lõi & Cơ sở lý thuyết</span>
              </h3>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                {activeTopic.concepts.map((concept, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{concept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Công thức toán học */}
            {activeTopic.formulaList && activeTopic.formulaList.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>2. Công thức thống kê áp dụng</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {activeTopic.formulaList.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-1.5"
                    >
                      <div className="font-bold text-xs text-blue-900">{f.name}</div>
                      <div className="p-2.5 bg-white rounded-lg border border-blue-200 font-mono text-xs sm:text-sm text-blue-950 overflow-x-auto text-center font-bold">
                        {f.formula}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">{f.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Các bước tính toán */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>3. Trình tự các bước tính toán chuẩn</span>
              </h3>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
                {activeTopic.calculationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Ví dụ số liệu thể thao thực tế có lời giải */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-600" />
                <span>4. Ví dụ số liệu thực tế trong Giáo dục Thể chất & Lời giải</span>
              </h3>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-4">
                <div className="border-b border-emerald-100 pb-3">
                  <div className="font-bold text-sm text-emerald-950">
                    {activeTopic.sportExample.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {activeTopic.sportExample.description}
                  </p>
                  <div className="inline-block mt-2 px-2.5 py-1 bg-white border border-emerald-200 rounded-md text-[11px] font-mono text-emerald-800">
                    {activeTopic.sportExample.data}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Các bước giải chi tiết:
                  </div>
                  {activeTopic.sportExample.solutionSteps.map((s, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-emerald-800">{s.step}</div>
                      <div className="leading-relaxed whitespace-pre-line">{s.content}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs leading-relaxed flex items-start gap-2 shadow-xs">
                  <Award className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Kết luận sư phạm:</strong>
                    {activeTopic.sportExample.conclusion}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Lưu ý & Sai sót hay gặp */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Lưu ý quan trọng & Lỗi sai người học hay mắc:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-950 leading-relaxed">
                {activeTopic.pitfallsAndNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TAB: BẢNG CHỌN PHƯƠNG PHÁP THỐNG KÊ (KHI NÀO DÙNG GÌ?) */}
      {/* ========================================================= */}
      {subTab === 'decision-table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Table className="w-5 h-5 text-blue-600" />
              <span>Bảng ma trận: Khi nào dùng phương pháp nào trong Thể dục Thể thao?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bảng tra cứu chuẩn xác nhất giúp sinh viên xác định ngay phương pháp thống kê tương ứng dựa trên Bản chất dữ liệu, Số lượng nhóm và Quan hệ mẫu.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3.5">Bản chất dữ liệu</th>
                  <th className="p-3.5">Số nhóm / Biến</th>
                  <th className="p-3.5">Quan hệ mẫu</th>
                  <th className="p-3.5">Mục đích nghiên cứu TDTT</th>
                  <th className="p-3.5">Phương pháp khuyến nghị</th>
                  <th className="p-3.5 text-center">Ký hiệu</th>
                  <th className="p-3.5">Điều kiện áp dụng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STATISTICAL_DECISION_TABLE.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-900">{row.dataNature}</td>
                    <td className="p-3.5">{row.groupCount}</td>
                    <td className="p-3.5 text-slate-600">{row.sampleRelation}</td>
                    <td className="p-3.5 font-medium text-slate-800">{row.purpose}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200/60 inline-block">
                        {row.recommendedMethod}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-indigo-700 text-sm">
                      {row.symbol}
                    </td>
                    <td className="p-3.5 text-slate-500 italic text-[11px]">{row.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-bold text-slate-800 block">Quy tắc 1: Kiểm tra Giả định</span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Luôn kiểm tra phân phối chuẩn (Shapiro-Wilk) và phương sai đồng nhất (Levene) trước khi quyết định dùng tham số hay phi tham số.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-bold text-slate-800 block">Quy tắc 2: Không lạm dụng t-test</span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Nếu có từ 3 nhóm độc lập trở lên, bắt buộc dùng ANOVA một yếu tố để tránh lạm phát sai lầm loại I (Family-wise Error Rate).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-bold text-slate-800 block">Quy tắc 3: Tương quan ≠ Nhân quả</span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Hệ số tương quan r cao chỉ cho thấy sự biến thiên cùng chiều/ngược chiều, không tự động chứng minh mối quan hệ nhân quả vật lý.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TAB: 30 CÂU TRẮC NGHIỆM TƯƠNG TÁC THI THỬ               */}
      {/* ========================================================= */}
      {subTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Top Action Bar & Scoreboard */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Phần 2: 30 Câu Hỏi Trắc Nghiệm Môn Toán Thống Kê TDTT
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Cơ cấu: 10 câu Nhận biết + 10 câu Thông hiểu + 10 câu Vận dụng tính toán. Đáp án đúng phân bố đều.
                </p>
              </div>

              {/* Timer & Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{formattedTime}</span>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={instantExplainMode}
                    onChange={(e) => setInstantExplainMode(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded"
                  />
                  <span>Chế độ học (Hiện giải thích ngay)</span>
                </label>

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={totalAnswered === 0}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Nộp bài & Chấm điểm ({totalAnswered}/30)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Làm lại từ đầu</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scorecard banner (visible after submission) */}
            {isSubmitted && (
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200 p-5 rounded-2xl animate-in fade-in duration-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center font-extrabold shadow-md">
                      <span className="text-xl leading-none">{scoreDetails.scoreOutOf10}</span>
                      <span className="text-[10px] font-normal uppercase opacity-80">/ 10 điểm</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Kết quả bài thi trắc nghiệm: {scoreDetails.correctCount}/30 câu đúng ({scoreDetails.percentage}%)
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Thời gian hoàn thành: <strong>{formattedTime}</strong> • Số câu làm sai: <strong className="text-rose-600">{scoreDetails.wrongCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                        scoreDetails.scoreOutOf10 >= 8.5
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : scoreDetails.scoreOutOf10 >= 7.0
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : scoreDetails.scoreOutOf10 >= 5.0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {scoreDetails.scoreOutOf10 >= 8.5
                        ? 'Xếp loại: Xuất sắc 🏆'
                        : scoreDetails.scoreOutOf10 >= 7.0
                        ? 'Xếp loại: Giỏi ✨'
                        : scoreDetails.scoreOutOf10 >= 5.0
                        ? 'Xếp loại: Đạt / Trung bình 👍'
                        : 'Cần ôn tập lại kỹ lý thuyết ⚠️'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500 mr-1">Lọc câu hỏi:</span>

              <button
                onClick={() => setActiveLevelFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLevelFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả (30)
              </button>

              <button
                onClick={() => setActiveLevelFilter('recognition')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLevelFilter === 'recognition'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Nhận biết (10)
              </button>

              <button
                onClick={() => setActiveLevelFilter('comprehension')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLevelFilter === 'comprehension'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Thông hiểu (10)
              </button>

              <button
                onClick={() => setActiveLevelFilter('application')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLevelFilter === 'application'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Vận dụng tính toán (10)
              </button>

              {isSubmitted && scoreDetails.wrongCount > 0 && (
                <button
                  onClick={() => setActiveLevelFilter('wrong')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeLevelFilter === 'wrong'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  Xem {scoreDetails.wrongCount} câu sai
                </button>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const selectedAnswer = userAnswers[q.id];
              const showExplanation = isSubmitted || instantExplainMode;
              const isCorrect = selectedAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-300 ring-1 ring-emerald-300/50'
                        : 'border-rose-300 ring-1 ring-rose-300/50'
                      : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {q.topicRef}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          q.level === 'recognition'
                            ? 'bg-slate-100 text-slate-700'
                            : q.level === 'comprehension'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {q.levelLabel}
                      </span>

                      {isSubmitted && (
                        <span
                          className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-md ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đúng</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Sai (Đáp án: {q.correctAnswer})</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Body */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt) => {
                      const isChosen = selectedAnswer === opt.key;
                      const isThisCorrect = opt.key === q.correctAnswer;

                      let optStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                      if (isSubmitted || instantExplainMode) {
                        if (isThisCorrect) {
                          optStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 font-semibold';
                        } else if (isChosen && !isThisCorrect) {
                          optStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 font-medium';
                        } else {
                          optStyle = 'border-slate-200 opacity-60 text-slate-600 bg-white';
                        }
                      } else if (isChosen) {
                        optStyle = 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-600/20 font-semibold';
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.key)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border ${
                              isChosen
                                ? isSubmitted
                                  ? isThisCorrect
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'bg-rose-600 border-rose-600 text-white'
                                  : 'bg-blue-600 border-blue-600 text-white'
                                : isThisCorrect && (isSubmitted || instantExplainMode)
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-slate-100 border-slate-300 text-slate-700'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  {showExplanation && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/90 space-y-2.5 text-xs text-slate-700 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Lời giải thích chi tiết & Đáp án đúng: {q.correctAnswer}</span>
                      </div>

                      <p className="leading-relaxed whitespace-pre-line text-slate-800">
                        {q.explanation}
                      </p>

                      {q.calculationSteps && q.calculationSteps.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px] text-blue-900">
                          <span className="font-sans font-bold text-slate-700 block text-xs">
                            Các bước tính toán:
                          </span>
                          {q.calculationSteps.map((step, sIdx) => (
                            <div key={sIdx}>• {step}</div>
                          ))}
                        </div>
                      )}

                      {q.commonMistake && (
                        <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/70">
                          ⚠️ <strong>Bẫy thường gặp:</strong> {q.commonMistake}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TAB: BẢNG ĐÁP ÁN TỔNG HỢP 30 CÂU                      */}
      {/* ========================================================= */}
      {subTab === 'answer-key' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>Bảng tra cứu đáp án chính thức 30 câu trắc nghiệm</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dành cho sinh viên và giảng viên tra cứu nhanh, kiểm tra kết quả bài làm trên giấy hoặc đối chiếu công thức.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
            {QUIZ_QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between shadow-2xs"
              >
                <span className="text-xs font-semibold text-slate-600">Câu {q.id}</span>
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {q.correctAnswer}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed space-y-1">
            <strong>Tỷ lệ phân bố đáp án chuẩn đề thi:</strong>
            <div className="flex flex-wrap gap-4 pt-1 font-semibold">
              <span>Đáp án A: 8 câu (26.7%)</span>
              <span>Đáp án B: 7 câu (23.3%)</span>
              <span>Đáp án C: 8 câu (26.7%)</span>
              <span>Đáp án D: 7 câu (23.3%)</span>
            </div>
            <p className="text-[11px] text-blue-700/80 pt-1 italic">
              Đảm bảo tính phân bố ngẫu nhiên và đều đặn theo quy chuẩn khảo thí giáo dục thể chất quốc gia.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
