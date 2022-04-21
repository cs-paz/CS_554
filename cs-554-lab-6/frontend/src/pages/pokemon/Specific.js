import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";
import styles from "./styles.css";
import { useDispatch, useSelector } from "react-redux";

const Specific = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const trainers = useSelector((state) => state);
  const selectedTrainer = trainers.find((t) => t.isSelected);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/pokemon/${id}`);
      setPokemon(response.data);
      console.log(response.data);
      setIsLoaded(true);
    } catch (e) {
      navigate("/404");
    }
  }, []);

  return (
    <>
      {isLoaded ? (
        <div className="main content">
          <h1>{pokemon.name}</h1>
          <img
            src={pokemon.image}
            alt={`${pokemon.name} image`}
            width={200}
            height={200}
          />
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
          <p>Types: {pokemon.types.map((t) => t.type.name).join(", ")}</p>
          {!selectedTrainer.pokemon.find(
            (p) => p.pokemonName === pokemon.name
          ) ? (
            <button
              onClick={() => {
                dispatch({
                  type: "ADD_POKEMON",
                  payload: { pokemonName: pokemon.name, image: pokemon.image },
                });
              }}
            >
              Catch
            </button>
          ) : (
            <button
              onClick={() => {
                dispatch({
                  type: "DELETE_POKEMON",
                  payload: { pokemonName: pokemon.name },
                });
              }}
            >
              Release
            </button>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Specific;
