import { validasaur } from "../../deps.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

const validationRules = {
    questionText: [validasaur.required, validasaur.minLength(1)]
};

const listQuestions = async ({ params, render, state }) => {
    const data = {
        user: await state.session.get("user"),
        topic: await topicService.findTopicById(params.id),
        questions: await questionService.listQuestionsByTopicId(params.id),
        questionText: "",
        errors: [],
    }
    render("topicQuestions.eta", data)
};

const addQuestion = async ({ params, render, request, response, state }) => {
    const body = request.body({ type: "form" });
    const bodyParams = await body.value;
    const user = await state.session.get("user");

    const data = {
      user: user,
      topic: await topicService.findTopicById(params.id),
      questions: await questionService.listQuestionsByTopicId(params.id),
      questionText: bodyParams.get("question_text"),
      errors: [],
    };
    
    const [passes, errors] = await validasaur.validate(data, validationRules);
    
    if (passes) {
        await questionService.addQuestion(data.user.id, data.topic.id, data.questionText);
        response.redirect(`/topics/${data.topic.id}`);
    } else {
        data.errors = errors;
        render("topicQuestions.eta", data);
    }
};

const deleteQuestion = async ({ params, response }) => {
    await questionService.deleteQuestion(params.qId);
    response.redirect(`/topics/${params.tId}`);
};

export { listQuestions, addQuestion, deleteQuestion };