import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";

const Comics = () => {
  const { page } = useParams();
  const [comics, setComics] = useState([]);

  const navigate = useNavigate();

  useEffect(async () => {
    const response = await axios.get(`${urls.comics}&offset=${page * 20}`);
    response?.data?.data?.count !== 0
      ? setComics(response.data.data.results)
      : navigate("/404");
  }, [page]);

  const listOfComics = comics.map((comic) => (
    <div key={comic.id} className="listElem">
      <Link to={`/comics/${comic.id}`}>{comic.title}</Link>
      <div>
        <img
          src={`${comic.thumbnail.path}.${comic.thumbnail.extension}${urls.creds}`}
          width="100"
          alt="comic image"
        />
      </div>
    </div>
  ));

  return (
    <div className="main">
      <h1 className="headerContainer">Comics Page {page}</h1>
      <div className="buttons">
        <Link to="/">
          <div className="button">
            <p>Home</p>
          </div>
        </Link>
        {parseInt(page) > 0 && (
          <Link to={`/comics/page/${parseInt(page) - 1}`}>
            <div className="button">
              <p>Previous</p>
            </div>
          </Link>
        )}
        <Link to={`/comics/page/${parseInt(page) + 1}`}>
          <div className="button">
            <p>Next</p>
          </div>
        </Link>
      </div>
      <div className="list">{listOfComics}</div>
    </div>
  );
};

export default Comics;
