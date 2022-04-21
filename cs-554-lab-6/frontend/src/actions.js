const createTrainer = ({ name }) => ({
  type: "CREATE_TRAINER",
  payload: { name },
});

const deleteTrainer = ({ id }) => ({
  type: "DELETE_TRAINER",
  payload: { id },
});

const selectTrainer = ({ id }) => ({
  type: "SELECT_TRAINER",
  payload: { id },
});

const addPokemon = ({ pokemonName }) => ({
  type: "ADD_POKEMON",
  payload: { pokemonName },
});

const deletePokemon = ({ pokemonName }) => ({
  type: "DELETE_POKEMON",
  payload: { pokemonName },
});
