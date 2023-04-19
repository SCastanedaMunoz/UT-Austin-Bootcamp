import axios from "axios";

const URL = "https://randomuser.me/api/?nat=us&inc=name,email,picture,phone,gender,dob,location&results=";

const API = {
  getUsers: async function (amount) {
    return await axios.get(URL + amount);
  },
};

export default API;