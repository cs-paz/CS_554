import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";
import styles from "./styles.css";

const Characters = () => {
  const { page } = useParams();
  const [characters, setCharacters] = useState([]);

  const navigate = useNavigate();

  useEffect(async () => {
    const response = await axios.get(`${urls.characters}&offset=${page * 20}`);
    console.log(response);
    response?.data?.data?.count !== 0
      ? setCharacters(response.data.data.results)
      : navigate("/404");
  }, [page]);

  const listOfCharacters = characters.map((character) => (
    <div key={character.id} className="listElem">
      <Link to={`/characters/${character.id}`}>{character.name}</Link>
      <div>
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}${urls.creds}`}
          width="100"
          alt="character image"
        />
      </div>
    </div>
  ));

  return (
    <div className="main">
      <div>
        <h1 className="headerContainer">Characters Page {page}</h1>
        <div className="buttons">
          <Link to="/">
            <div className="button">
              <p>Home</p>
            </div>
          </Link>
          {parseInt(page) > 0 && (
            <Link to={`/characters/page/${parseInt(page) - 1}`}>
              <div className="button">
                <p>Previous</p>
              </div>
            </Link>
          )}
          <Link to={`/characters/page/${parseInt(page) + 1}`}>
            <div className="button">
              <p>Next</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="list">{listOfCharacters}</div>
    </div>
  );
};

export default Characters;
