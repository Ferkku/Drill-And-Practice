import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const listTopics = async ({ render, state }) => {
    const user = await state.session.get("user");
    const data = {
        user: user,
        topics: await topicService.findAll()
    };
    render("quiz.eta", data);
};

const getRandomQuestion = async ({ params, render, response, state }) => {
    const questions = await questionService.listQuestionsByTopicId(params.tId);
    const data = {
        user: await state.session.get("user"),
        topic: await topicService.findTopicById(params.tId),
    };

    if (questions && questions.length > 0) {
        const question = questions[Math.floor(Math.random() * questions.length)];
        response.redirect(`/quiz/${params.tId}/questions/${question.id}`);
    }
    else {
        render("quizNoQuestions.eta", data);
    }
};

const listAnswerOptions = async ({ params, render, state }) => {
    const data = {
        user: await state.session.get("user"),
        topic: await topicService.findTopicById(params.tId),
        question: await questionService.findQuestionById(params.qId),
        options: await answerService.listAnswerOptions(params.qId),
    };
    render("quizQuestion.eta", data);
};

const answerQuestion = async ({ params, response, state }) => {
    const user = await state.session.get("user");
    const option = await answerService.findAnswerOptionById(params.oId);
    await answerService.addAnswerToQuestion(user.id, params.qId, params.oId);
  
    if (option.is_correct) {
       response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
    } else {
        response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
    }
};

const correctAnswer = async ({ params, render, state }) => {
    const data = {
        user: await state.session.get("user"),
        topic: await topicService.findTopicById(params.tId),
        question: await questionService.findQuestionById(params.qId),
    };
    render("quizCorrect.eta", data);
};
  
const incorrectAnswer = async ({ params, render, state }) => {
    const data = {
        user: await state.session.get("user"),
        topic: await topicService.findTopicById(params.tId),
        question: await questionService.findQuestionById(params.qId),
        correctOption: await answerService.findCorrectAnswerOption(params.qId),
    };
    render("quizIncorrect.eta", data);
};

export { 
    listTopics,
    getRandomQuestion,
    listAnswerOptions,
    answerQuestion,
    correctAnswer,
    incorrectAnswer
};