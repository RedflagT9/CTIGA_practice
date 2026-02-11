
import React, { useState, useEffect } from 'react';
import { ExamPage, ExamItem, UserAnswer, ExamStatus } from '../types';
import MarkdownContent from './MarkdownContent';
import { ChevronLeft, ChevronRight, Timer, LayoutDashboard, Send, Grid3X3 } from 'lucide-react';

interface ExamViewProps {
  pages: ExamPage[];
  userAnswers: Record<string, UserAnswer>;
  onAnswer: (qId: string, answer: Partial<UserAnswer>) => void;
  onSubmit: () => void;
  timeLeft: number;
}

const ExamView: React.FC<ExamViewProps> = ({ pages, userAnswers, onAnswer, onSubmit, timeLeft }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const progress = (answeredCount / totalPages) * 100;

  const goToNext = () => {
    if (currentPageIndex < totalPages - 1) setCurrentPageIndex(currentPageIndex + 1);
  };

  const goToPrev = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-grow w-full">
        <div className="sticky top-4 z-40 bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-md shadow-indigo-100">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">CTIGA Practice Session</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Page {currentPageIndex + 1} of {totalPages}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
              <Timer className="w-4 h-4" />
              <span className="font-mono font-black text-lg">{formatTime(timeLeft)}</span>
            </div>
            
            <button 
              onClick={onSubmit}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              <Send className="w-4 h-4" />
              Nộp Bài
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">
           <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden">
             <div 
               className="bg-indigo-500 h-full transition-all duration-700 ease-out" 
               style={{ width: `${progress}%` }}
             />
           </div>
           <span className="text-xs font-black text-slate-500 whitespace-nowrap uppercase tracking-widest">{answeredCount}/{totalPages} Đã làm</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/40 min-h-[500px] flex flex-col overflow-hidden">
          <div className="p-10 flex-grow">
            {currentPage.items.map((item, idx) => (
              <div key={item.id || idx} className="mb-10 last:mb-0">
                {(item.type === 'question-multiple-choice' || item.type === 'question-free-text') && (
                  <div className="space-y-8">
                    <div className="flex gap-5">
                      <span className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white font-black flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-100">
                        {currentPageIndex + 1}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight pt-1">
                        {item.question}
                      </h3>
                    </div>
                    
                    <div className="pl-0 md:pl-14">
                      {item.type === 'question-multiple-choice' ? (
                        <div className="grid gap-3">
                          {item.answers?.map((ans) => {
                            const isSelected = userAnswers[item.id]?.selectedId === ans.id;
                            return (
                              <button
                                key={ans.id}
                                onClick={() => onAnswer(item.id, { questionId: item.id, selectedId: ans.id })}
                                className={`group flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all ${
                                  isSelected 
                                    ? 'bg-indigo-50 border-indigo-500 shadow-md ring-4 ring-indigo-500/10' 
                                    : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected ? 'border-indigo-600 bg-indigo-600 scale-110' : 'border-slate-300'
                                }`}>
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                </div>
                                <span className={`text-base md:text-lg font-bold leading-snug ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>
                                  {ans.answer}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <textarea
                            rows={3}
                            placeholder="Nhập câu trả lời của bạn..."
                            value={userAnswers[item.id]?.textAnswer || ''}
                            onChange={(e) => onAnswer(item.id, { questionId: item.id, textAnswer: e.target.value })}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-lg shadow-inner"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-8 border-t-2 border-slate-50 flex items-center justify-between bg-slate-50/50">
            <button
              onClick={goToPrev}
              disabled={currentPageIndex === 0}
              className="flex items-center gap-2 px-6 py-3 font-black text-slate-500 hover:text-indigo-600 disabled:opacity-20 transition-all uppercase"
            >
              <ChevronLeft className="w-6 h-6" />
              Trước
            </button>

            <button
              onClick={goToNext}
              disabled={currentPageIndex === totalPages - 1}
              className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 disabled:opacity-30 transition-all uppercase"
            >
              Tiếp theo
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-8">
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl p-6 h-auto lg:h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-widest text-sm">
              <Grid3X3 className="w-4 h-4 text-indigo-500" />
              Danh sách câu
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">{totalPages} câu</span>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar grid grid-cols-5 gap-2 content-start">
            {pages.map((p, idx) => {
              const qId = p.items[0]?.id;
              const isAnswered = !!userAnswers[qId];
              const isCurrent = currentPageIndex === idx;
              
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`aspect-square flex items-center justify-center rounded-xl text-xs font-black transition-all border-2 ${
                    isCurrent 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : isAnswered 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                        : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamView;
