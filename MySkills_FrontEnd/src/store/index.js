import { createStore } from "vuex";

import { auth } from "./auth.store";
import { skills } from "./skill.store";
import { users } from "./user.store";

export default createStore({
  modules: {
    auth,
    skills,
    users,
  }
});