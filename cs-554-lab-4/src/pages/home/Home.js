import styles from "./styles.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="main">
      <div className="headerContainer">
        <h1>Marvel API React Project</h1>
      </div>
      <div className="captionContainer">
        <p>
          The purpose of this project is to become familiar with React hooks, as
          well as Pagination and React UI building. The project is also built
          using the Marvel API which is a RESTful API containing a lot of
          information about various marvel characters, comics, series, etc.
        </p>
        <h2>
          Click the links below for information on Marvel Characters, Comics,
          and Series!
        </h2>
      </div>
      <div className="linksContainer">
        <Link to="/characters/page/0">Characters </Link>
        <Link to="/comics/page/0">Comics </Link>
        <Link to="/series/page/0">Series </Link>
      </div>
    </div>
  );
};

export default Home;
