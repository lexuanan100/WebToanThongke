import React from 'react';
import { foundersList } from '../data/foundersData';
import { Award, GraduationCap, Heart, Sparkles, BookOpen, Users } from 'lucide-react';

export const FoundersView: React.FC = () => {
  // Helper to extract clean initials for avatar fallback
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return 'TV';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    // For Vietnamese names: First letter of family name + First letter of given name (e.g. Lê An -> LA)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Pastel gradient colors for avatar backgrounds
  const avatarGradients = [
    'from-blue-600 to-indigo-600',
    'from-sky-500 to-blue-700',
    'from-indigo-500 to-cyan-600',
    'from-blue-500 to-teal-600',
    'from-cyan-600 to-blue-800',
    'from-blue-700 to-indigo-800',
    'from-indigo-600 to-sky-600',
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      {/* Header with Logo */}
      <div className="text-center space-y-4">
        {/* HCMUE Logo */}
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
          <img
            src="/logo-hcmue.png"
            alt="Logo Đại học Sư phạm TP. Hồ Chí Minh"
            className="h-16 sm:h-20 w-auto object-contain"
          />
        </div>

        {/* Title & Badge */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-3.5 h-3.5" />
            <span>Về chúng tôi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Đội ngũ sáng lập
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Nhóm sinh viên Đại học Sư phạm TP. Hồ Chí Minh cùng xây dựng công cụ phân tích thống kê phục vụ học tập và nghiên cứu trong Thể dục thể thao.
          </p>
        </div>
      </div>

      {/* Grid of Founders: 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {foundersList.map((founder, index) => {
          const gradient = avatarGradients[index % avatarGradients.length];
          const initials = getInitials(founder.name);

          return (
            <div
              key={founder.id}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Subtle top decorative accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Avatar: Photo or Monogram */}
              <div className="relative mb-4 mt-2">
                {founder.avatar ? (
                  <img
                    src={founder.avatar}
                    alt={founder.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all"
                  />
                ) : (
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-tr ${gradient} text-white font-extrabold text-2xl flex items-center justify-center border-4 border-white shadow-md ring-2 ring-blue-100 group-hover:ring-blue-300 group-hover:scale-105 transition-all`}
                  >
                    {initials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              {/* Full Name */}
              <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                {founder.name}
              </h3>

              {/* Role */}
              <div className="mt-1.5">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80 inline-block">
                  {founder.role || 'Thành viên sáng lập'}
                </span>
              </div>

              {/* Bio / University tag */}
              {founder.bio && (
                <p className="mt-3 text-xs text-slate-500 font-medium">
                  {founder.bio}
                </p>
              )}

              {/* Member index counter badge */}
              <div className="mt-auto pt-4 text-[11px] text-slate-400 font-mono">
                Thành viên #{index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Purpose & Mission Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 backdrop-blur-xs border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mục tiêu dự án</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Đổi mới phương pháp học tập Toán thống kê trong Giáo dục Thể chất
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Dự án được xây dựng với mục tiêu hỗ trợ sinh viên, giảng viên và huấn luyện viên dễ dàng thực hiện các phép phân tích thống kê chuyên biệt cho kiểm tra đánh giá thể lực, từ thống kê mô tả, kiểm định t-test, ANOVA cho tới biểu đồ trực quan hóa dữ liệu — tất cả được xử lý tự động, bảo mật và trực quan ngay trên trình duyệt.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200 font-medium">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-400" />
              Tài liệu chuẩn sư phạm
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Đại học Sư phạm TP. Hồ Chí Minh
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              Phát triển vì cộng đồng người học TDTT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
