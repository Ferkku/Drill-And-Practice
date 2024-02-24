import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const getRandomQuestion = async ({ response }) => {
    const questions = await questionService.listAllQuestions();
    const question = questions[Math.floor(Math.random() * questions.length)];
    const options = await answerService.listAnswerOptions(question.id);

    const data = {
        questionId: question.id,
        questionText: question.question_text,
        answerOptions: [],
    };

    options.forEach(option => {
        data.answerOptions.push({ optionId: option.id, optionText: option.option_text })
    });
    
    response.body = data;
};

const processAnswer = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const document = await body.value;
    const answer = await answerService.findAnswerOptionById(document.optionId)

    response.body = { correct: answer.is_correct };
};

export { getRandomQuestion, processAnswer };