import { Router } from "express";
const router=Router();
import * as  controller from '../controllers/controller.js'
import question from "../models/question.js";
console.log('Controller keys:', Object.keys(controller));
/* router.get('/questions',controller.getQuestions);
router.post('/questions',controller.inserQuestions); */
router.route('/questions')
  .get(controller.getQuestions)
  .post(controller.inserQuestions)
  .delete(controller.dropQuestions);

// ✅ Add this route for title-based fetch
router.get('/questions/:title', controller.getQuestionsByTitle);
router.post("/upload-question", async (req, res) => {
    try {
        const { examTitle, questions, answers } = req.body;

        const newExam = new question({
            examTitle,
            questions,
            answers,
        });

        await newExam.save();

        res.json({ message: "Exam uploaded successfully", newExam });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.route('/result')
  .get(controller.getResult)
  .post(controller.insertResult)
  .delete(controller.dropresult);

export default router;