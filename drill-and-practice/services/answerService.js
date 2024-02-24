import { sql } from "../database/database.js";

const listAnswerOptions = async (id) => {
    return await sql`
    SELECT *
    FROM question_answer_options
    WHERE question_id=${id}`
};

const addAnswerOption = async (qId, optionText, isCorrect) => {
    await sql`
    INSERT INTO question_answer_options (question_id, option_text, is_correct)
    VALUES (${qId}, ${optionText}, ${isCorrect})`;
};

const deleteAnswerOption = async (id) => {
    await sql`
    DELETE FROM question_answer_options
    WHERE id=${id}`;
};

const deleteAnswers = async (id) => {
    await sql`
    DELETE FROM question_answers
    WHERE question_answer_option_id=${id}`;
};

const findAnswerOptionById = async (oId) => {
    const option = await sql`
    SELECT *
    FROM question_answer_options
    WHERE id=${oId}`;
    return option[0];
};

const addAnswerToQuestion = async (userId, qId, oId) => {
    await sql`
    INSERT INTO question_answers (user_id, question_id, question_answer_option_id)
    VALUES (${userId}, ${qId}, ${oId})`;
};

const findCorrectAnswerOption = async (qId) => {
    const answer = await sql`
    SELECT *
    FROM question_answer_options
    WHERE question_id=${qId} AND is_correct;`;
    return answer[0];
};

export { 
    listAnswerOptions, 
    addAnswerOption, 
    deleteAnswerOption, 
    deleteAnswers, 
    findAnswerOptionById, 
    addAnswerToQuestion,
    findCorrectAnswerOption
};