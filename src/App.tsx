/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DataManagement } from './components/DataManagement';
import { DescriptiveStats } from './components/DescriptiveStats';
import { ChartsView } from './components/ChartsView';
import { TTestView } from './components/TTestView';
import { AnovaView } from './components/AnovaView';
import { GuideView } from './components/GuideView';
import { TheoryAndQuizView } from './components/TheoryAndQuizView';
import { FoundersView } from './components/FoundersView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Column, RowData } from './types';
import { Activity, AlertTriangle, BookOpen, ShieldCheck, Trash2, X } from 'lucide-react';

const STORAGE_KEY = 'statxai_student_fitness_data_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Initialize with strictly empty state (0 students, 0 prefilled data)
  const [columns, setColumns] = useState<Column[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.columns)) {
          return parsed.columns;
        }
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [rows, setRows] = useState<RowData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.rows)) {
          return parsed.rows;
        }
      }
    } catch {
      // Ignore
    }
    // Strictly empty array on first launch
    return [];
  });

  // Local storage auto-persistence
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          columns,
          rows,
        })
      );
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [columns, rows]);

  // AI assistant status
  const [hasAiKey, setHasAiKey] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/ai-status')
      .then((res) => res.json())
      .then((data) => setHasAiKey(Boolean(data.hasApiKey)))
      .catch(() => setHasAiKey(false));
  }, []);

  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);

  // Trigger modal when clicking clear
  const handleClearAll = () => {
    setIsClearModalOpen(true);
  };

  // Perform full clear (both columns and rows)
  const handleExecuteFullClear = () => {
    setColumns([]);
    setRows([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setIsClearModalOpen(false);
  };

  // Perform rows-only clear (keep column structure)
  const handleExecuteRowsOnlyClear = () => {
    setRows([]);
    setIsClearModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        columns={columns}
        rows={rows}
        onClearData={handleClearAll}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        hasAiKey={hasAiKey}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeView setActiveTab={setActiveTab} rowsCount={rows.length} />
        )}

        {activeTab === 'data' && (
          <DataManagement
            columns={columns}
            rows={rows}
            setColumns={setColumns}
            setRows={setRows}
            onClearAll={handleClearAll}
          />
        )}

        {activeTab === 'descriptive' && (
          <DescriptiveStats
            columns={columns}
            rows={rows}
            onOpenDataTab={() => setActiveTab('data')}
          />
        )}

        {activeTab === 'charts' && (
          <ChartsView
            columns={columns}
            rows={rows}
            onOpenDataTab={() => setActiveTab('data')}
          />
        )}

        {activeTab === 'ttest' && (
          <TTestView
            columns={columns}
            rows={rows}
            onOpenDataTab={() => setActiveTab('data')}
          />
        )}

        {activeTab === 'anova' && (
          <AnovaView
            columns={columns}
            rows={rows}
            onOpenDataTab={() => setActiveTab('data')}
            onOpenAiExplain={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === 'theory' && <TheoryAndQuizView />}

        {activeTab === 'guide' && <GuideView />}

        {activeTab === 'about' && <FoundersView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800">StatxAI</span>
              <span>– Nền tảng học tập tương tác Toán thống kê trong Giáo dục Thể chất</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              © 2026 Nhóm sáng lập - Đại học Sư phạm TP. Hồ Chí Minh
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu lưu trữ cục bộ</span>
            </span>
            <span className="hidden md:inline">•</span>
            <button
              onClick={() => setActiveTab('about')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Về chúng tôi
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('guide')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Cẩm nang hướng dẫn
            </button>
          </div>
        </div>
      </footer>

      {/* AI Consultation Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        columns={columns}
        rows={rows}
      />

      {/* Clear Table Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Xác nhận xóa bảng dữ liệu</h3>
                  <p className="text-xs text-slate-500">
                    Bảng hiện có: <strong>{rows.length}</strong> dòng, <strong>{columns.length}</strong> cột
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa dữ liệu? Thao tác này sẽ giải phóng toàn bộ số liệu đo kiểm thể lực hiện có trong bộ nhớ trình duyệt. Hãy chọn phương án phù hợp:
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExecuteFullClear}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa sạch toàn bộ (Cả cột và dòng)</span>
              </button>

              {columns.length > 0 && rows.length > 0 && (
                <button
                  onClick={handleExecuteRowsOnlyClear}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  Chỉ xóa các dòng số liệu (Giữ nguyên các cột biến)
                </button>
              )}

              <button
                onClick={() => setIsClearModalOpen(false)}
                className="w-full py-2 px-4 bg-transparent hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-medium"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
