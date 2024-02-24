import { sql } from "../database/database.js";

const listStats = async () => {
    const topics = (await sql`SELECT COUNT (*) FROM topics`)[0].count;
    const questions = (await sql`SELECT COUNT (*) FROM questions`)[0].count;
    const answers = (await sql`SELECT COUNT (*) FROM question_answers`)[0].count;
    
    const stats = {
        topics: topics === undefined ? 0 : topics,
        questions: questions === undefined ? 0 : questions,
        answers: answers === undefined ? 0 : answers
    }
    return stats;
}

export { listStats }