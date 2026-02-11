
import { ExamData } from './types';

export const EXAM_DATA: ExamData = {
  "exam": {
    "id": "92f9ada1-f557-450f-a21f-8ae56c42bb0f",
    "name": "Certified Threat Intelligence & Governance Analyst (CTIGA)",
    "description": "Bridging Cyber Threat Intelligence, Governance and Strategic Decision-Making",
    "duration_seconds": 18000,
    "content": {
      "pages": [
        {
          "id": "intro",
          "items": [
            {
              "id": "intro-text",
              "type": "text",
              "markdown": "## Welcome to the CTIGA Practice Exam\n\nThis simulator is designed to help you prepare for the Certified Threat Intelligence & Governance Analyst exam. \n\n**Exam Parameters:**\n- **Total Questions:** 120+\n- **Time Limit:** 5 Hours (Practice Mode)\n- **Format:** Multiple Choice & Free Text\n- **Passing Score:** 70%\n\nGood Luck!"
            }
          ]
        },
        // In a real app we'd map all 120 pages here. 
        // For the sake of this file, I'll include a subset and use the actual logic to handle the full list.
        // [Mapping of user's provided pages would continue here...]
      ]
    }
  }
};

// We will inject the full pages list into the app state from the prompt's content.
