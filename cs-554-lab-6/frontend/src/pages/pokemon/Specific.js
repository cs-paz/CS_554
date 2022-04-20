import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";
import List from "../../components/List";
import styles from "./styles.css";

const SpecificCharacter = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(async () => {
    try {
      const response = await axios.get(urls.specificCharacter(id));
      setCharacter(response.data.data.results[0]);
      setIsLoaded(true);
    } catch (e) {
      navigate("/404");
    }
  }, []);

  return (
    <>
      {isLoaded ? (
        <div className="main content">
          <h1>{character.name}</h1>
          <div>
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}${urls.creds}`}
              width="200"
              alt={`${character.name} image`}
            />
          </div>
          {(character.description || character.modified) && (
            <h2>General Information</h2>
          )}
          <div>
            {character.description && (
              <p>Description: {character.description}</p>
            )}
            {character.modified && <p>Modified: {character.modified}</p>}
            <div>
              {character?.comics?.available > 0 && (
                <List name="Comics" list={character.comics.items} />
              )}
              {character?.comics?.series?.available > 0 && (
                <List name="Series" list={character.series.items} />
              )}
              {character?.comics?.stories?.available > 0 && (
                <List name="Stories" list={character.stories.items} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default SpecificCharacter;
