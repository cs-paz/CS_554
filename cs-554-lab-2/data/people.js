const axios = require("axios");

getById = (id) => {
  const parsedId = parseInt(id);
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const response = await axios.get(
        "https://gist.githubusercontent.com/graffixnyc/ed50954f42c3e620f7c294cf9fe772e8/raw/925e36aa8e3d60fef4b3a9d8a16bae503fe7dd82/lab2"
      );
      const people = response.data;
      if (!people) {
        reject(new Error("API request failed."));
      }
      const person = people.find((person) => parsedId === person.id);
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
