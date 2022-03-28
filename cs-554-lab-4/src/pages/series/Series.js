import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";

const Series = () => {
  const { page } = useParams();
  const [series, setSeries] = useState([]);

  const navigate = useNavigate();

  useEffect(async () => {
    const response = await axios.get(`${urls.series}&offset=${page * 20}`);
    response?.data?.data?.count !== 0
      ? setSeries(response.data.data.results)
      : navigate("/404");
  }, [page]);

  const listOfSeries = series.map((serie) => (
    <div key={serie.id} className="listElem">
      <Link to={`/series/${serie.id}`}>{serie.title}</Link>
      <div>
        <img
          src={`${serie.thumbnail.path}.${serie.thumbnail.extension}${urls.creds}`}
          width="100"
          alt="series image"
        />
      </div>
    </div>
  ));

  return (
    <div className="main">
      <h1 className="headerContainer">Series Page {page}</h1>
      <div className="buttons">
        <Link to="/">
          <div className="button">
            <p>Home</p>
          </div>
        </Link>
        {parseInt(page) > 0 && (
          <Link to={`/series/page/${parseInt(page) - 1}`}>
            <div className="button">
              <p>Previous</p>
            </div>
          </Link>
        )}
        <Link to={`/series/page/${parseInt(page) + 1}`}>
          <div className="button">
            <p>Next</p>
          </div>
        </Link>
      </div>
      <div className="list">{listOfSeries}</div>
    </div>
  );
};

export default Series;
