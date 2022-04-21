import { v4 as uuid } from "uuid";
const initalState = [
  {
    id: uuid(),
    name: "Ash",
    pokemon: [],
    isSelected: true,
  },
];

let copyState = null;
let index = 0;

const reducer = (state = initalState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CREATE_TRAINER":
      return [...state, { name: payload.name, pokemon: [], isSelected: false }];
    case "DELETE_TRAINER":
      return state.filter((trainer) => trainer.id !== payload.id);
    case "SELECT_TRAINER":
      return state.map((trainer) => {
        if (trainer.id === payload.id) {
          return { ...trainer, isSelected: true };
        } else {
          return { ...trainer, isSelected: false };
        }
      });
    case "ADD_POKEMON":
      copyState = [...state];
      index = copyState.findIndex((trainer) => trainer.isSelected);
      copyState[index].pokemon.push({
        pokemonName: payload.pokemonName,
        image: payload.image,
      });
      return copyState;
    case "DELETE_POKEMON":
      copyState = [...state];
      index = copyState.findIndex((trainer) => trainer.isSelected);
      copyState[index].pokemon = copyState[index].pokemon.filter(
        (p) => p.pokemonName !== payload.pokemonName
      );
      return copyState;
    default:
      return state;
  }
};

export default reducer;
