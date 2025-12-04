import { Router } from "express";
const router=Router();
import * as  controller from '../controllers/controller.js'
import question from "../models/question.js";
import User from "../models/User.js"
console.log('Controller keys:', Object.keys(controller));
/* router.get('/questions',controller.getQuestions);
router.post('/questions',controller.inserQuestions); */
router.route('/questions')
  .get(controller.getQuestions)
   
  .delete(controller.dropQuestions);
router.post("/questions/:examFile", controller.insertExamFromFile);

// ✅ Add this route for title-based fetch
router.get('/questions/:title', controller.getQuestionsByTitle);



router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.route('/result')
  .get(controller.getResult)
  .post(controller.insertResult)
  .delete(controller.dropresult);

export default router;