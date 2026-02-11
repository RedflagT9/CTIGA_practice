
export type QuestionType = 'question-multiple-choice' | 'question-free-text';

export interface Answer {
  id: string;
  answer: string;
}

export interface ExamItem {
  id: string;
  type: QuestionType | 'text';
  question?: string;
  answers?: Answer[];
  markdown?: string;
  match_type?: string;
}

export interface ExamPage {
  id: string;
  items: ExamItem[];
}

export interface ExamData {
  exam: {
    id: string;
    name: string;
    description: string;
    content: {
      pages: ExamPage[];
    };
    duration_seconds: number;
  };
}

export interface UserAnswer {
  questionId: string;
  selectedId?: string;
  textAnswer?: string;
}

export type ExamStatus = 'idle' | 'running' | 'finished';
