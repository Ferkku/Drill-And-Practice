import { validasaur } from "../../deps.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const validationRules = {
    name: [validasaur.required, validasaur.minLength(1)]
};

const listTopics = async ({ render, state }) => {
    const user = await state.session.get("user");
    const data = {
        user: user,
        topics: await topicService.findAll(),
        name: ""
    };
    render("topics.eta", data);
};

const addTopic = async ({ render, request, response, state }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    const user = await state.session.get("user");
  
    const data = {
      user: user,
      topics: await topicService.findAll(),
      name: params.get("name"),
      user_id: user.id,
      errors: [],
    };

    const [passes, errors] = await validasaur.validate(data, validationRules);

    if (passes && user.admin) {
        await topicService.addTopic(data.name, data.user_id);
        response.redirect("/topics");
    } else {
        data.errors = errors;
        render("topics.eta", data);
    }
};

const deleteTopic = async({ params, response, state }) => {
    const user = await state.session.get("user")
    if (user.admin) {
        const questions = await questionService.listQuestionsByTopicId(params.id);

        for (const question of questions) {
            const answerOptions = await answerService.listAnswerOptions(question.id);
            for (const option of answerOptions) {
                await answerService.deleteAnswers(option.id);
                await answerService.deleteAnswerOption(option.id);
            };
            await questionService.deleteQuestion(question.id);
        };

        await topicService.deleteTopic(params.id);
    }
    response.redirect("/topics");
};

export { listTopics, addTopic, deleteTopic };