import { sql } from "../database/database.js";

const listQuestionsByTopicId = async (tId) => {
    return await sql`
    SELECT *
    FROM questions
    WHERE topic_id=${tId}`;
};

const addQuestion = async (userId, tId, questionText) => {
    await sql`
    INSERT INTO questions (user_id, topic_id, question_text)
    VALUES (${userId}, ${tId}, ${questionText})`;
};

const findQuestionById = async (id) => {
    const question = await sql`
    SELECT *
    FROM questions
    WHERE id=${id}`;
    return question[0];
};

const deleteQuestion = async (id) => {
    await sql`
    DELETE FROM questions
    WHERE id=${id}`;
};

const listAllQuestions = async () => {
    return await sql`
    SELECT *
    FROM questions`
};

export {
    listQuestionsByTopicId,
    addQuestion,
    findQuestionById,
    deleteQuestion,
    listAllQuestions
};