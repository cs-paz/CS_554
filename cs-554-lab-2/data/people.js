const axios = require("axios");

getById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const people = await axios.get(
        "https://gist.githubusercontent.com/graffixnyc/ed50954f42c3e620f7c294cf9fe772e8/raw/925e36aa8e3d60fef4b3a9d8a16bae503fe7dd82/lab2"
      );
      if (!people) {
        reject(new Error("API request failed."));
      }
      const person = people.data.find((person) => id === person.id);
      if (person) {
        resolve(person);
      } else {
        reject(new Error("ID doesn't exist."));
      }
    }, 5000);
  });
};

module.exports = {
  getById,
};
