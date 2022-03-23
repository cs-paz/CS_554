import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";

const Comics = () => {
  const { page } = useParams();
  const [comics, setComics] = useState([]);

  useEffect(async () => {
    const response = await axios.get(`${urls.comics}&offset=${page * 20}`);
    setComics(response.data.data.results);
  }, []);

  const listOfComics = comics.map((comic) => (
    <div key={comic.id}>
      <Link to={`/comics/${comic.id}`}>{comic.title}</Link>
      <div>
        <img
          src={`${comic.thumbnail.path}.${comic.thumbnail.extension}${urls.creds}`}
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
      {listOfComics}
    </div>
  );
};

export default Comics;
