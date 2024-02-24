import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";

const processLogin = async ({ render, request, response, state }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const data = {
        user: await state.session.get("user"),
        email: params.get("email"),
        password: params.get("password"),
        errors: [],
    };

    const userFromDatabase = await userService.findUserByEmail(data.email);

    if (userFromDatabase.length != 1) {
        data.errors.push({ user: "Wrong email or password" });
        render("login.eta", data);
        return;
    }

    const user = userFromDatabase[0];
    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
        data.errors.push({ user: "Wrong email or password" });
        render("login.eta", data);
        return;
    }

    await state.session.set("user", user);
    response.redirect("/topics");
};

const showLoginForm = ({ render }) => {
    const data = {
        email: "",
        password: "",
        errors: [],
    };
    render("login.eta", data);
};

export { showLoginForm, processLogin }