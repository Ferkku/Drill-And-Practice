import * as statsService from "../../services/statisticService.js"

const showMain = async ({ render, state }) => {
  const data = await statsService.listStats();
  data.user = await state.session.get("user");
  render("main.eta", data);
};

export { showMain };
