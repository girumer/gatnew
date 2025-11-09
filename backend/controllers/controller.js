import Questions from "../models/question.js";
import Results from "../models/result.js";
import questions, { answers ,examTitle} from '../database/ERMP2022PARTTWO.js'
export async function getQuestions(req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const exams = await Questions.find().lean();

    if (exams.length === 0) {
      return res.json({ q: [] });
    }

    const allQuestions = exams.flatMap((exam) =>
      exam.questions.map((q, index) => {
        const imageUrl = q.image ? `${baseUrl}${q.image}` : null;
        return {
          ...q,
          answer: exam.answers?.[index] ?? null,
          image: imageUrl,
        };
      })
    );

    res.json({ q: allQuestions });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ error: "Failed to load questions" });
  }
}

// ✅ Get questions by exam title
export async function getQuestionsByTitle(req, res) {
  try {
    const { title } = req.params;
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const exam = await Questions.findOne({ examTitle: new RegExp(`^${title}$`, "i") }).lean();

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const questionsWithAnswers = exam.questions.map((q, index) => {
      const imageUrl = q.image ? `${baseUrl}${q.image}` : null;
      return {
        ...q,
        answer: exam.answers?.[index] ?? null,
        image: imageUrl,
      };
    });

    res.json({ q: questionsWithAnswers });
  } catch (error) {
    console.error("Error fetching exam by title:", error);
    res.status(500).json({ error: "Failed to load exam" });
  }
}




export async function inserQuestions(req, res) {
  try {
    const data = await Questions.insertMany([
      { questions,  answers ,examTitle}
    ]);

    res.json({ msg: "Data saved successfully", data });
  } catch (error) {
    res.json({ error: error.message });
  }
}

export async function dropQuestions(req,res){
   try {
    const data = await Questions.deleteMany();

    res.json({ msg: "questions deleted  successfully"});
  } catch (error) {
    res.json({ error: error.message });
  }
}
export async function getResult(req,res){
    try{
      const r= await Results.find()
      res.json({r});
    }
    catch(error){
        res.json({error})
    }
}
export async function insertResult(req,res){
    try {
    const {username,result,attempts,points,achived} = req.body;
    if(!username&&!result)throw new Error('data not Provided!');
    Results.create({username,result,attempts,points,achived})

   
     res.json({ msg: "result saved successfully" });
  } catch (error) {
    res.json({ error: error.message });
  }
}
export async function dropresult(req,res){
    try {
    const data = await Results.deleteMany();

    res.json({ msg: "result deleted  successfully"});
  } catch (error) {
    res.json({ error: error.message });
  }
}