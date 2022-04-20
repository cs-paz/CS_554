import styles from "./styles.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="main">
      <div className="headerContainer">
        <h1>Pokemon API Redux Lab</h1>
      </div>
      <div className="captionContainer">
        <p>
          The purpose of this project is to become familiar with using Redux. A
          trainer will be able to "catch" and "release" pokemon by clicking on
          the respective buttons on both individual pokemon pages and the
          paginated list linked below. The state will be stored entirely on the
          frontend using redux stores. A user will also be able to add and
          delete multiple trainers on the trainers page and create a pokemon
          team for each of them! Note that only one Trainer may be selected at
          any given point meaning a user must toggle between trainers if he or
          she intends to create multiple pokemon teams.
        </p>
        <h2></h2>
      </div>
      <div className="linksContainer">
        <Link to="/pokemon/page/0">Pokemon </Link>
        <Link to="/Trainers">Trainers </Link>
      </div>
    </div>
  );
};

export default Home;
