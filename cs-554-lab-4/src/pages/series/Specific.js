import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";
import List from "../../components/List";

const SpecificSeries = () => {
  const { id } = useParams();
  const [series, setSeries] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(async () => {
    try {
      const response = await axios.get(urls.specificSeries(id));
      setSeries(response.data.data.results[0]);
      setIsLoaded(true);
    } catch (e) {
      navigate("/404");
    }
  }, []);

  return (
    <>
      {isLoaded ? (
        <div className="main content">
          <h1>{series.title}</h1>
          <div>
            <img
              src={`${series.thumbnail.path}.${series.thumbnail.extension}${urls.creds}`}
              width="200"
              alt={`${series.title} image`}
            />
          </div>
          <div>
            {(series.description ||
              series.startYear ||
              series.endYear ||
              series.rating ||
              series.type ||
              series.modifed) && <h2>General Information</h2>}
            {series.description && <p>Description: {series.description}</p>}
            {series.startYear && <p>Start Year: {series.startYear}</p>}
            {series.endYear && <p>End Year: {series.endYear}</p>}
            {series.rating && <p>Rating: {series.rating}</p>}
            {series.type && <p>Type: {series.type}</p>}
            {series.modified && <p>Modified: {series.modified}</p>}
            <div>
              {series?.comics?.available > 0 && (
                <List name="Comics" list={series.comics.items} />
              )}
              {series?.characters?.available > 0 && (
                <List name="Characters" list={series.characters.items} />
              )}
              {series?.stories?.available > 0 && (
                <List
                  name="Stories"
                  list={series.stories.items}
                  isLinked={false}
                />
              )}
              {series.creators.available > 0 && (
                <List
                  name="Creators"
                  list={series.creators.items}
                  isLinked={false}
                />
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

export default SpecificSeries;
