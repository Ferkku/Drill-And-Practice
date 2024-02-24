import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerController from "./controllers/answerController.js";
import * as quizController from "./controllers/quizController.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.listTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);

router.get("/topics/:id", questionController.listQuestions);
router.post("/topics/:id/questions", questionController.addQuestion);
router.post("/topics/:tId/questions/:qId/delete", questionController.deleteQuestion);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/topics/:id/questions/:qId", answerController.listAnswerOptions);
router.post("/topics/:id/questions/:qId/options", answerController.addAnswerOption);
router.post("/topics/:tId/questions/:qId/options/:oId/delete", answerController.deleteAnswerOption);

router.get("/quiz", quizController.listTopics);
router.get("/quiz/:tId", quizController.getRandomQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.listAnswerOptions);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.answerQuestion);
router.get("/quiz/:tId/questions/:qId/correct", quizController.correctAnswer);
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.incorrectAnswer);

router.get("/api/questions/random", api.getRandomQuestion);
router.post("/api/questions/answer", api.processAnswer);

export { router };
