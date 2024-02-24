import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const validationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)]
};

const registerUser = async ({ request, response, render }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const data = {
        email: params.get("email"),
        password: params.get("password"),
        errors: []
    };

    const [passes, errors] = await validasaur.validate(data, validationRules);
    const existingUsers = await userService.findUserByEmail(data.email);
    
    if (existingUsers.length > 0) {
        data.errors = errors;
        data.errors.email = { email: "The email is already reserved" };
        render("registration.eta", data)
    } else if (!passes) {
        data.errors = errors;
        render("registration.eta", data);
    } else {
        await userService.addUser(
            data.email,
            await bcrypt.hash(data.password),
        );
        response.redirect("/auth/login");
    }
  
};

const showRegistrationForm = ({ render }) => {
    const data = {
        email: "",
        password: "",
        errors: [],
    };
    render("registration.eta", data);
};

export { registerUser, showRegistrationForm };