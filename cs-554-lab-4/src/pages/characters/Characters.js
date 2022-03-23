import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";

const Characters = () => {
  const { page } = useParams();
  const [characters, setCharacters] = useState([]);

  useEffect(async () => {
    const response = await axios.get(`${urls.characters}&offset=${page * 20}`);
    setCharacters(response.data.data.results);
  }, []);

  const listOfCharacters = characters.map((character) => (
    <div key={character.id}>
      <Link to={`/characters/${character.id}`}>{character.name}</Link>
      <div>
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}${urls.creds}`}
          width="100"
        />
      </div>
    </div>
  ));

  return (
    <div>
      <div>
        <button>Previous</button>
        <button>Next</button>
      </div>
      {listOfCharacters}
    </div>
  );
};

export default Characters;
