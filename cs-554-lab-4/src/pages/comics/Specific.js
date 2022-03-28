import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";
import List from "../../components/List";

const SpecificComic = () => {
  const { id } = useParams();
  const [comic, setComic] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(async () => {
    try {
      const response = await axios.get(urls.specificComic(id));
      setComic(response.data.data.results[0]);
      setIsLoaded(true);
    } catch (e) {
      navigate("/404");
    }
  }, [id]);

  let key = 0;
  let prices = null;

  if (comic?.prices?.length > 0) {
    prices = comic.prices.map((price) => {
      key++;
      return (
        <div key={key}>
          <p>
            {price.type}: ${price.price}
          </p>
        </div>
      );
    });
  }

  return (
    <>
      {isLoaded ? (
        <div className="main content">
          <h1>{comic.title}</h1>
          <div>
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}${urls.creds}`}
              width="200"
              alt={`${comic.title} image`}
            />
          </div>
          {(comic.description ||
            comic.modified ||
            comic.digitalId ||
            comic.issueNumber ||
            comic.variantDescription ||
            comic.isbn ||
            comic.upc ||
            comic.format ||
            comic.pageCount) && <h2>General Information</h2>}

          {comic.digitalId ? <p>Digital ID: {comic.digitalId}</p> : null}
          {comic.issueNumber ? <p>Issue Number: {comic.issueNumber}</p> : null}
          {comic.description ? <p>Description: {comic.description}</p> : null}
          {comic.variantDescription ? (
            <p>Variant Description: {comic.variantDescription}</p>
          ) : null}
          {comic.modified && <p>Modified: {comic.modified}</p>}
          {comic.isbn ? <p>ISBN: {comic.isbn}</p> : null}
          {comic.upc ? <p>UPC: {comic.upc}</p> : null}
          {comic.format ? <p>Format: {comic.format}</p> : null}
          {comic.pageCount ? <p>Page Count: {comic.pageCount}</p> : null}
          <div>
            {comic?.characters?.available > 0 && (
              <List name="Characters" list={comic.characters.items} />
            )}
            {comic?.series?.available > 0 && (
              <List name="Series" list={[comic.series]} />
            )}
            {comic?.stories?.available > 0 && (
              <List
                name="Stories"
                list={comic.stories.items}
                isLinked={false}
              />
            )}
            {comic?.creators?.available > 0 && (
              <List
                name="Creators"
                list={comic.creators.items}
                isLinked={false}
              />
            )}
            {comic.dates && <h2>Important Dates:</h2>}
            {comic.dates.map((date) => (
              <div key={`${date.type}${key++}`}>
                <p>
                  {date.type}: {date.date}
                </p>
              </div>
            ))}
            {prices}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default SpecificComic;
