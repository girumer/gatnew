import questions, { answers ,examTitle} from '../database/ERMP2023PARTONE.js'
import fs from 'fs';

const fixedQuestions = questions.map((q, index) => ({
  id: q.id || index + 1,
  question: q.question || q.Question || q.text || "Your question here",
  options: q.options || q.Options || [],
  explanation: q.explanation || q.Explanation || "",
}));

fs.writeFileSync('fixed_questions.json', JSON.stringify(fixedQuestions, null, 2));
console.log('Questions fixed with ids!');
