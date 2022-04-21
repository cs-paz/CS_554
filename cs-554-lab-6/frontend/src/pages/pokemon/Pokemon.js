import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import urls from "../../env";
import styles from "./styles.css";

const Pokemon = () => {
  const { page } = useParams();
  const [pokemon, setPokemon] = useState([]);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trainers = useSelector((state) => state);
  const selectedTrainer = trainers.find((t) => t.isSelected);

  useEffect(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/pokemon/page/${page}`
      );
      if (response.data.length < 1) {
        throw new Error("No data");
      }
      setPokemon(response.data);
    } catch (e) {
      navigate("/404");
    }
  }, [page]);

  const listOfPokemon = pokemon?.map((p) => (
    <div key={p.name} className="listElem">
      <Link to={`/pokemon/${p.name}`}>
        <div>
          <p>{p.name}</p>
          <img src={p.image} width="100" alt="pokemon image" />
        </div>
      </Link>
      <div>
        {!selectedTrainer.pokemon.find(
          (pokemon) => pokemon.pokemonName === p.name
        ) ? (
          <button
            onClick={() => {
              dispatch({
                type: "ADD_POKEMON",
                payload: { pokemonName: p.name, image: p.image },
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
                payload: { pokemonName: p.name },
              });
            }}
          >
            Release
          </button>
        )}
      </div>
    </div>
  ));

  return (
    <div className="main">
      <div>
        <h1 className="headerContainer">Page {page}</h1>
        <div className="buttons">
          <Link to="/">
            <div className="button">
              <p>Home</p>
            </div>
          </Link>
          {parseInt(page) > 0 && (
            <Link to={`/pokemon/page/${parseInt(page) - 1}`}>
              <div className="button">
                <p>Previous</p>
              </div>
            </Link>
          )}
          <Link to={`/pokemon/page/${parseInt(page) + 1}`}>
            <div className="button">
              <p>Next</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="list">{listOfPokemon}</div>
    </div>
  );
};

export default Pokemon;
