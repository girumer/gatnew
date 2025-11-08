import express from "express";
import question from "../models/question.js";

const router = express.Router();

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

export default router;
