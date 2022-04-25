import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles.css";

const Trainers = () => {
  const { page } = useParams();
  const dispatch = useDispatch();
  const trainers = useSelector((state) => state);
  const selectedTrainer = trainers.find((t) => t.isSelected);
  const [addTrainer, setAddTrainer] = useState(false);
  const [trainerName, setTrainerName] = useState("");
  console.log(trainers);

  console.log(trainers);

  const listOfPokemon = (trainer) => {
    return trainer.pokemon.map((p) => (
      <div key={p.pokemonName} className="trainersPokemon">
        <Link to={`/pokemon/${p.pokemonName}`}>
          <div>
            <p>{p.pokemonName}</p>
            <img src={p.image} width="100" alt="pokemon image" />
          </div>
        </Link>
      </div>
    ));
  };

  const listOfTrainers = trainers?.map((t) => (
    <div key={t.name} className="trainer">
      <div>
        <h2>{t.name}</h2>
        {listOfPokemon(t)}
      </div>
      {!t.isSelected ? (
        <button
          onClick={() => {
            dispatch({
              type: "SELECT_TRAINER",
              payload: { id: t.id },
            });
          }}
        >
          Select Trainer
        </button>
      ) : (
        <p>Selected Trainer</p>
      )}
      {!t.isSelected && (
        <button
          onClick={() => {
            dispatch({
              type: "DELETE_TRAINER",
              payload: { id: t.id },
            });
          }}
        >
          Delete Trainer
        </button>
      )}
    </div>
  ));

  return (
    <div className="main">
      <div>
        <h1 className="headerContainer">Trainers</h1>
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
      <div>
        {!addTrainer ? (
          <button
            onClick={() => {
              setAddTrainer(true);
            }}
            style={{ padding: "20px 50px", marginBottom: "20px" }}
          >
            Add Trainer
          </button>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Trainer Name"
              onChange={(e) => setTrainerName(e.target.value)}
            />
            <button
              onClick={() => {
                dispatch({
                  type: "CREATE_TRAINER",
                  payload: { name: trainerName },
                });
                setAddTrainer(false);
              }}
            >
              Add Trainer
            </button>
          </div>
        )}
      </div>
      <div>{listOfTrainers}</div>
    </div>
  );
};

export default Trainers;
