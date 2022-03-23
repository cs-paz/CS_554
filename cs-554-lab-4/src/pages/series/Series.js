import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";

const Series = () => {
  const { page } = useParams();
  const [series, setSeries] = useState([]);

  useEffect(async () => {
    const response = await axios.get(`${urls.series}&offset=${page * 20}`);
    setSeries(response.data.data.results);
  }, []);

  const listOfSeries = series.map((serie) => (
    <div key={serie.id}>
      <Link to={`/series/${serie.id}`}>{serie.title}</Link>
      <div>
        <img
          src={`${serie.thumbnail.path}.${serie.thumbnail.extension}${urls.creds}`}
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
      {listOfSeries}
    </div>
  );
};

export default Series;
