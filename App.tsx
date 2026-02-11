
import React, { useState, useEffect, useMemo } from 'react';
import { CORRECT_ANSWERS } from './correctAnswers';
import { ExamPage, UserAnswer, ExamStatus } from './types';
import ExamView from './components/ExamView';
import ResultView from './components/ResultView';
import { ShieldAlert, BookOpen, Clock, Award, Play, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<ExamStatus>('idle');
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(18000); // 5 Hours default
  const [pages, setPages] = useState<ExamPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions dynamically from the external JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        // Using relative path to the root directory
        const response = await fetch('./questions.json');
        if (!response.ok) {
          throw new Error(`Failed to load questions.json: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data.pages) {
          setPages(data.pages);
        } else {
          throw new Error('Invalid questions.json format: "pages" array not found.');
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    let timer: number;
    if (status === 'running' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'running') {
      setStatus('finished');
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const handleStart = () => {
    if (pages.length === 0) return;
    setStatus('running');
  };

  const handleAnswer = (qId: string, answer: Partial<UserAnswer>) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], ...answer }
    }));
  };

  const handleSubmit = () => {
    const totalQuestions = pages.length;
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = totalQuestions - answeredCount;
    
    const msg = unansweredCount > 0 
      ? `CHÚ Ý: Bạn còn ${unansweredCount} câu chưa trả lời.\n\nBạn có chắc chắn muốn kết thúc bài thi không?`
      : 'Bạn đã hoàn thành các câu hỏi. Nộp bài để xem kết quả?';
      
    if (window.confirm(msg)) {
      setStatus('finished');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    if (window.confirm('CẢNH BÁO: Làm lại từ đầu sẽ xóa hết các câu trả lời hiện tại. Tiếp tục?')) {
      setUserAnswers({});
      setTimeLeft(18000);
      setStatus('idle');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Đang tải ngân hàng câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6 text-center">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-rose-100 max-w-md">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Lỗi Tải Dữ Liệu</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {status === 'idle' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 max-w-4xl w-full text-center relative overflow-hidden transition-all hover:shadow-indigo-500/5">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-50 rounded-full opacity-60 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-50 rounded-full opacity-60 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex p-6 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-100 mb-10 transform -rotate-3 transition-transform hover:rotate-0">
                <ShieldAlert className="w-16 h-16 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight uppercase">
                CTIGA<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">LUYỆN THI THỬ</span>
              </h1>
              
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mb-12 text-xs">
                Hệ thống mô phỏng kỳ thi chứng chỉ chuyên nghiệp
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 transition-all hover:border-indigo-200 group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                  </div>
                  <span className="block text-2xl font-black text-slate-800">{pages.length}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Câu hỏi</span>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 transition-all hover:border-indigo-200 group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-indigo-500" />
                  </div>
                  <span className="block text-2xl font-black text-slate-800">5 GIỜ</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Thời gian</span>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 transition-all hover:border-indigo-200 group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-indigo-500" />
                  </div>
                  <span className="block text-2xl font-black text-slate-800">70%</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Điểm đạt</span>
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="group relative w-full inline-flex items-center justify-center gap-4 bg-slate-900 hover:bg-black text-white py-6 rounded-3xl text-2xl font-black transition-all shadow-2xl hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-4 uppercase">
                  Bắt đầu thi ngay
                  <Play className="w-6 h-6 fill-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'running' && (
        <ExamView 
          pages={pages}
          userAnswers={userAnswers}
          onAnswer={handleAnswer}
          onSubmit={handleSubmit}
          timeLeft={timeLeft}
        />
      )}

      {status === 'finished' && (
        <ResultView 
          pages={pages}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      )}

      <footer className="text-center py-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        Certified Threat Intelligence & Governance Analyst Simulator
      </footer>
    </div>
  );
};

export default App;
