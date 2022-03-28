import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import urls from "../env";
import styles from "./styles.css";

let key = 0;

const List = ({ name, list, isLinked = true }) => {
  const [ids, setIds] = useState([]);
  useEffect(() => {
    const arr = [];
    list.forEach((item) => {
      arr.push([item.resourceURI.split("/").pop()]);
    });
    setIds(arr);
  }, []);

  const _list = list.map((elem, index) => (
    <div key={`${ids[index]}${key++}`}>
      {isLinked ? (
        <Link to={`/${name.toLowerCase()}/${ids[index]}`}>{elem.name}</Link>
      ) : (
        <div>
          <p>{elem.name} </p>
          {elem.role && <p>Role: {elem.role}</p>}
        </div>
      )}
    </div>
  ));

  return (
    <div className="contentList">
      <h2>{name}</h2>
      {_list}
    </div>
  );
};

export default List;
