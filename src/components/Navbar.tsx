import React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  Database,
  FileSpreadsheet,
  GitCompare,
  GraduationCap,
  Home,
  Sparkles,
  Download,
  Trash2,
  Users
} from 'lucide-react';
import { Column, RowData } from '../types';
import { exportToCSV } from '../utils/csv';

export type TabType = 'home' | 'data' | 'descriptive' | 'charts' | 'ttest' | 'anova' | 'theory' | 'guide' | 'about';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  columns: Column[];
  rows: RowData[];
  onClearData: () => void;
  onOpenAiModal?: () => void;
  hasAiKey?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  columns,
  rows,
  onClearData,
  onOpenAiModal,
  hasAiKey = false,
}) => {
  const quantitativeCount = columns.filter((c) => c.type === 'quantitative').length;

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'data', label: 'Nhập dữ liệu', icon: Database },
    { id: 'descriptive', label: 'Thống kê mô tả', icon: Calculator },
    { id: 'charts', label: 'Biểu đồ', icon: BarChart3 },
    { id: 'ttest', label: 'Kiểm định t', icon: GitCompare },
    { id: 'anova', label: 'ANOVA', icon: Activity },
    { id: 'theory', label: 'Lý thuyết & Trắc nghiệm', icon: GraduationCap },
    { id: 'guide', label: 'Hướng dẫn', icon: BookOpen },
    { id: 'about', label: 'Về chúng tôi', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner / Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] sm:min-h-[72px] py-1.5 sm:py-2">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
            >
              <img
                src="/logo-hcmue.png"
                alt="Logo Đại học Sư phạm TP. Hồ Chí Minh"
                className="h-[40px] sm:h-[56px] w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight leading-tight">
                    Toán thống kê và đo lường thể dục thể thao
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
                  Trường Đại học Sư phạm TP. Hồ Chí Minh
                </p>
              </div>
            </button>
          </div>

          {/* Quick Stats & Global Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Realtime dataset badge */}
            <div className="text-xs font-medium text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200/80 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong className="font-semibold text-slate-900">{rows.length}</strong> dòng
              </span>
              <span className="text-slate-300">|</span>
              <span>
                <strong className="font-semibold text-slate-900">{columns.length}</strong> cột ({quantitativeCount} định lượng)
              </span>
            </div>

            {/* Quick Export CSV if rows > 0 */}
            {rows.length > 0 && (
              <button
                onClick={() => exportToCSV(columns, rows)}
                title="Xuất bảng dữ liệu hiện tại sang tệp CSV"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Xuất CSV</span>
              </button>
            )}

            {/* AI Assistant Button */}
            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
                title="Cố vấn học tập AI Thống kê Thể chất"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Trợ lý Cố vấn AI</span>
                {hasAiKey && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.id === 'data' && rows.length > 0 && (
                    <span
                      className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rows.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
