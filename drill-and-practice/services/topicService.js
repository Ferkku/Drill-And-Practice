import { sql } from "../database/database.js";

const findAll = async () => {
    return await sql`
    SELECT *
    FROM topics
    ORDER BY name`;
};

const addTopic = async (name, userId) => {
    await sql`
    INSERT INTO topics (name, user_id)
    VALUES (${name}, ${userId})`;
};

const findTopicById = async (id) => {
    const topics = await sql`
    SELECT *
    FROM topics
    WHERE id=${id}`;
    return topics[0];
};

const deleteTopic = async (id) => {
    await sql`
    DELETE FROM topics
    WHERE id=${id}`;
};

export { findAll, addTopic, findTopicById, deleteTopic };