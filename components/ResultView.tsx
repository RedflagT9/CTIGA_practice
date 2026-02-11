
import React from 'react';
import { ExamPage, UserAnswer } from '../types';
import { CORRECT_ANSWERS } from '../correctAnswers';
import { Trophy, RefreshCw, CheckCircle2, XCircle, BarChart3, Clock, Target, AlertCircle } from 'lucide-react';

interface ResultViewProps {
  pages: ExamPage[];
  userAnswers: Record<string, UserAnswer>;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ pages, userAnswers, onRestart }) => {
  const allQuestions = pages.flatMap(p => p.items).filter(i => i.type.startsWith('question'));
  const totalCount = allQuestions.length;
  
  let correctCount = 0;
  let skippedCount = 0;

  const results = allQuestions.map(q => {
    const userAns = userAnswers[q.id];
    const correctVal = CORRECT_ANSWERS[q.id];
    let isCorrect = false;

    if (!userAns) {
      skippedCount++;
    } else if (q.type === 'question-multiple-choice') {
      isCorrect = userAns.selectedId === correctVal;
    } else {
      const normalizedUser = (userAns.textAnswer || '').trim().toLowerCase();
      const normalizedCorrect = (correctVal || '').trim().toLowerCase();
      // Simple keyword match or exact match for free text
      isCorrect = normalizedUser === normalizedCorrect || (normalizedCorrect.length > 3 && normalizedUser.includes(normalizedCorrect));
    }

    if (isCorrect) correctCount++;
    return { ...q, isCorrect, userAns, correctVal };
  });

  const score = Math.round((correctCount / totalCount) * 100);
  const passed = score >= 70;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-700">
      {/* Top Banner Result */}
      <div className={`relative overflow-hidden rounded-[2.5rem] shadow-2xl border ${passed ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400'} text-white`}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
        
        <div className="relative p-10 md:p-16 text-center space-y-6">
          <div className="inline-flex p-5 rounded-3xl bg-white/20 backdrop-blur-md mb-4 ring-1 ring-white/30">
            {passed ? <Trophy className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
          </div>
          
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2">
              {passed ? 'PASSED' : 'FAILED'}
            </h1>
            <p className="text-xl font-medium opacity-90 max-w-2xl mx-auto">
              {passed 
                ? "Excellent work! You've demonstrated a strong grasp of Cyber Threat Intelligence & Governance concepts."
                : "You didn't reach the 70% passing threshold. Focus on the domains marked below for improvement."}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4">
             <div className="bg-black/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                <div className="text-4xl font-black">{score}%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70">Final Percentage</div>
             </div>
             <div className="bg-black/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                <div className="text-4xl font-black">{correctCount}/{totalCount}</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70">Raw Score</div>
             </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Target className="w-6 h-6" /></div>
             <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Accuracy</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{score}%</div>
          <p className="text-sm text-slate-500 mt-1">Target is 70% or higher</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><Clock className="w-6 h-6" /></div>
             <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Completion</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{Math.round(((totalCount - skippedCount) / totalCount) * 100)}%</div>
          <p className="text-sm text-slate-500 mt-1">{skippedCount} questions left unanswered</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
          <button 
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            RETAKE EXAM
          </button>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            Detailed Review
          </h2>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Correct
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <div className="w-3 h-3 rounded-full bg-rose-500" /> Incorrect
             </div>
          </div>
        </div>

        <div className="space-y-4">
          {results.map((q, idx) => (
            <div 
              key={q.id} 
              className={`bg-white border-2 rounded-[2rem] overflow-hidden transition-all hover:shadow-lg ${q.isCorrect ? 'border-emerald-50' : 'border-rose-50'}`}
            >
              <div className="flex items-stretch">
                 <div className={`w-2 shrink-0 ${q.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                 <div className="p-8 flex-grow">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-widest mb-2">
                          Question {idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-800 leading-tight">
                          {q.question}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-xl shrink-0 ${q.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {q.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-5 rounded-2xl border ${q.isCorrect ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' : 'bg-rose-50/50 border-rose-100 text-rose-900'}`}>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Your Answer</div>
                        <div className="font-bold text-sm">
                          {q.type === 'question-multiple-choice' 
                            ? (q.answers?.find(a => a.id === q.userAns?.selectedId)?.answer || 'NOT ANSWERED')
                            : (q.userAns?.textAnswer || 'NOT ANSWERED')}
                        </div>
                      </div>

                      {!q.isCorrect && (
                        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900">
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Correct Solution</div>
                          <div className="font-bold text-sm">
                            {q.type === 'question-multiple-choice' 
                              ? (q.answers?.find(a => a.id === q.correctVal)?.answer || 'N/A')
                              : (q.correctVal || 'N/A')}
                          </div>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="py-12 flex justify-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-colors"
          >
            Back to top
          </button>
      </div>
    </div>
  );
};

export default ResultView;
