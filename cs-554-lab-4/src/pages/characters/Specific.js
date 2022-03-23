import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";
import List from "../../components/List";

const SpecificCharacter = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(async () => {
    const response = await axios.get(urls.specificCharacter(id));
    setCharacter(response.data.data.results[0]);
    setIsLoaded(true);
  }, []);

  return (
    <>
      {isLoaded ? (
        <div>
          <h1>{character.name}</h1>
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
