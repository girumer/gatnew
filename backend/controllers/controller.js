import Questions from "../models/question.js";
import Results from "../models/result.js";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
export async function getQuestions(req, res) {
  try {
    //const baseUrl = `${req.protocol}://${req.get("host")}`;
    const baseUrl = `https://${req.get("host")}`;
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




/* export async function inserQuestions(req, res) {
  try {
    const data = await Questions.insertMany([
      { questions,  answers ,examTitle}
    ]);

    res.json({ msg: "Data saved successfully", data });
  } catch (error) {
    res.json({ error: error.message });
  }
} */
// controllers/questionController.js







export async function insertExamFromFile(req, res) {
  try {
    const { examFile } = req.params; // e.g. "GAT1"
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Build absolute path to the file
    const modulePath = path.join(__dirname, `../database/${examFile}.js`);

    // Convert to file:// URL for ESM import
    const fileUrl = pathToFileURL(modulePath).href;

    // Dynamically import the exam file
    const examModule = await import(fileUrl);

    // ✅ Handle mixed exports
    const examTitle = examModule.examTitle;
    const questions = examModule.default; // default export
    const answers = examModule.answers;

    if (!questions || !answers || !examTitle) {
      return res.status(400).json({ error: "Exam file missing required exports" });
    }

    // Insert into DB
    const data = await Questions.insertMany([{ examTitle, questions, answers }]);

    res.json({ msg: `Exam ${examTitle} inserted successfully`, data });
  } catch (error) {
    console.error("Insert exam error:", error);
    res.status(500).json({ error: error.message });
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
export async function getResult(req, res) {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const results = await Results.find({phoneNumber}).sort({ createdAt: -1 });

    res.json({ results });
  } catch (error) {
    console.error("Get result error:", error);
    res.status(500).json({ error: "Failed to load results" });
  }
}

export async function insertResult(req,res){
  try {
    console.log("✅ Incoming POST /result");
    console.log("✅ Body:", req.body);

    const {username,phoneNumber,result,attempts,points,achived} = req.body;

    if(!username && !result)
      throw new Error('data not Provided!');

    const saved = await Results.create({username,phoneNumber,result,attempts,points,achived,exam,year,part});

    console.log("✅ Saved to DB:", saved);

    res.json({ msg: "result saved successfully" });
  } catch (error) {
    console.log("❌ Error in insertResult:", error);
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