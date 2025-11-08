// Updated model
import mongoose from "mongoose";
const { Schema } = mongoose;

const questionModel = new Schema({
    examTitle: { type: String, default: "" },
    questions: [{
        id: Number,
        question: String,
        options: [String],
        explanation: String,
        image: { type: String, default: "" }
    }],
    answers: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionModel);