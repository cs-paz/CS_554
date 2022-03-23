import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../../env";
import List from "../../components/List";

const SpecificComic = () => {
  const { id } = useParams();
  const [comic, setComic] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(async () => {
    const response = await axios.get(urls.specificComic(id));
    console.log(response);
    setComic(response.data.data.results[0]);
    setIsLoaded(true);
  }, []);

  let key = 0;
  let prices = null;

  if (comic.prices.length > 0) {
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
        <div>
          <h1>{comic.title}</h1>
          {comic.digitalId && <p>Digital ID: {comic.digitalId}</p>}
          {comic.issueNumber && <p>Issue Number: {comic.issueNumber}</p>}
          {comic.description && <p>Description: {comic.description}</p>}
          {comic.variantDescription && (
            <p>Variant Description: {comic.variantDescription}</p>
          )}
          {comic.modified && <p>Modified: {comic.modified}</p>}
          {comic.isbn && <p>ISBN: {comic.isbn}</p>}
          {comic.upc && <p>UPC: {comic.upc}</p>}
          {comic.format && <p>Format: {comic.format}</p>}
          {comic.pageCount && <p>Page Count: {comic.pageCount}</p>}
          <div>
            {comic?.characters?.available > 0 && (
              <List name="Characters" list={comic.characters.items} />
            )}
            {comic?.series?.available > 0 && (
              <List name="Series" list={[comic.series]} />
            )}
            {comic?.stories?.available > 0 && (
              <List name="Stories" list={comic.stories.items} />
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
