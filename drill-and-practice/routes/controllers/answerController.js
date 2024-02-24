import { validasaur } from "../../deps.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const validationRules = {
    optionText: [validasaur.required, validasaur.minLength(1)]
};

const listAnswerOptions = async ({ params, render, state }) => {
    const data = {
        user: await state.session.get("user"),
        topic: await topicService.findTopicById(params.id),
        question: await questionService.findQuestionById(params.qId),
        answerOptions: await answerService.listAnswerOptions(params.qId),
        optionText: "",
        isCorrect: false,
        errors: [],
    };
    render("question.eta", data);
};

const addAnswerOption = async({ params, render, request, response, state }) => {
    const body = request.body({ type: "form" });
    const bodyParams = await body.value;
    const user = await state.session.get("user");

    const data = {
        user: user,
        topic: await topicService.findTopicById(params.id),
        question: await questionService.findQuestionById(params.qId),
        answerOptions: await answerService.listAnswerOptions(params.qId),
        optionText: bodyParams.get("option_text"),
        isCorrect: bodyParams.get("is_correct")  ? true : false,
        errors: [],
    };
    
    const [passes, errors] = await validasaur.validate(data, validationRules);
    
    if (passes) {
        await answerService.addAnswerOption(data.question.id, data.optionText, data.isCorrect);
        response.redirect(`/topics/${data.topic.id}/questions/${data.question.id}`);
    } else {
        data.errors = errors;
        render("question.eta", data);
    }
};

const deleteAnswerOption = async ({ params, response }) => {
    await answerService.deleteAnswers(params.oId);
    await answerService.deleteAnswerOption(params.oId);
    response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

export { listAnswerOptions, addAnswerOption, deleteAnswerOption }