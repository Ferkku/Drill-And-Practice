const { test, expect } = require("@playwright/test");

const question = `New question: ${Math.random()}`;

const loginAsAdmin = async (page) => {
    await page.goto("/auth/login");
    await page.locator("input[type=email]").type("admin@admin.com");
    await page.locator("input[type=password]").type("123456");
    await page.getByRole('button', { name: 'Login' }).click();
};

const loginAsDefaultUser = async (page) => {
    await page.goto("/auth/login");
    await page.locator("input[type=email]").type("test@test.com");
    await page.locator("input[type=password]").type("qwerty");
    await page.getByRole('button', { name: 'Login' }).click();
};

const addTopic = async (page) => {
    const topic = `New topic: ${Math.random()}`;
    await page.locator("input[type=text]").type(topic);
    await page.getByRole('button', { name: 'Add Topic' }).click();
    return topic;
};

test("User can register and create an account", async ({ page }) => {
    await page.goto("/auth/register");
    await page.locator("input[type=email]").type("test@test.com");
    await page.locator("input[type=password]").type("qwerty");
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.locator("h1")).toHaveText("Login");
});

test("User can login", async ({ page }) => {
    await loginAsDefaultUser(page);
    await expect(page.locator("h1")).toHaveText("Topics");
});

test("User can view topics", async ({ page }) => {
    await loginAsDefaultUser(page);
    await page.locator(`a >> text='${"Finnish language"}'`).click();
    await expect(page.locator("h1")).toHaveText("Finnish language");
});

test("Admin can create topics", async ({ page }) => {
    await loginAsAdmin(page);
    const topic = await addTopic(page);
    await expect(page.locator(`a >> text='${topic}'`)).toBeVisible();
});

test("User can add questions", async ({ page }) => {
    await loginAsDefaultUser(page);
    await page.goto("/topics/1");
    await page.locator("input[type=text]").type(question);
    await page.getByRole('button', { name: 'Add Question' }).click();
    await expect(page.locator(`a >> text='${question}'`)).toBeVisible();
});

test("User can view and add answer options", async ({ page }) => {
    await loginAsDefaultUser(page);
    await page.goto("/topics/1/questions/1");

    await page.locator("input[type=text]").type("Correct");
    await page.check("[name=is_correct]");
    await page.getByRole('button', { name: 'Add Answer' }).click();

    await expect(page.getByText('Correct ✅ Delete option')).toBeVisible();
});

test("User can view quizzes", async ({ page }) => {
    await loginAsDefaultUser(page);
    await page.goto("/quiz");
    await expect(page.locator("h1")).toHaveText("Quiz Topics");
});

test("User can answer quizzes", async ({ page }) => {
    await loginAsDefaultUser(page);

    await page.goto("/quiz/1/questions/1");
    await page.getByRole('button', { name: 'Choose' }).last().click();
    await expect(page.locator("p")).toHaveText("Correct!");

});

test("User can delete answer options", async ({ page }) => {
    await loginAsDefaultUser(page);
    await page.goto("/topics/1/questions/1");
    await page.getByRole('button', { name: 'Delete option' }).last().click();
    await expect(page.getByRole('button', { name: 'Delete question' })).toBeVisible();
});

test("User can delete questions", async ({ page }) => {
    await loginAsDefaultUser(page);
    await page.goto("/topics/1/questions/1");
    await page.getByRole('button', { name: 'Delete question' }).click();
    await expect(page.locator(`a >> text='${question}'`)).toHaveCount(0);
});