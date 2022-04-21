const express = require("express");
const router = express.Router();
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");

/*
Redis Cache
[
    {
        pageNum: int,
        data: [
            {
                ...
            }
        ]
    }
]
*/

router.get("/page/:pageNum", async (req, res) => {
  const { pageNum } = req.params;
  const pageNumInt = parseInt(pageNum);
  const cache = (await client.getAsync("pageCache")) || "[]";
  const parsedCache = JSON.parse(cache);

  let existsInCache = null;
  parsedCache?.forEach((elem) => {
    if (elem.pageNum === parseInt(pageNum)) {
      existsInCache = elem.data;
      return;
    }
  });
  if (existsInCache) {
    res.status(200).json(existsInCache);
    return;
  }

  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${pageNumInt * 20}&limit=20`
    );
    const pokemon = response.data.results;

    const pokemonWithImages = pokemon.map((p) => {
      return {
        ...p,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          p.url.split("/")[6]
        }.png`,
      };
    });

    const newCache = [
      ...parsedCache,
      {
        pageNum: parseInt(pageNum),
        data: pokemonWithImages,
      },
    ];
    await client.setAsync("pageCache", JSON.stringify(newCache));

    res.status(200).json(pokemonWithImages);
  } catch (err) {
    res.status(404).json({ error: "Page Not found" });
    return;
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const cache = (await client.getAsync("individualCache")) || "[]";
  const parsedCache = JSON.parse(cache);

  let existsInCache = null;
  parsedCache?.forEach((elem) => {
    if (elem.id === id || elem.data.name === id) {
      existsInCache = elem.data;
      return;
    }
  });
  if (existsInCache) {
    res.status(200).json(existsInCache);
    return;
  }

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = response.data;
    const { name, id: pokemonId, types, height, weight, sprites } = pokemon;
    const dataToCache = {
      id: pokemonId,
      name,
      types,
      height,
      weight,
      image: sprites.front_default,
    };
    const newCache = [
      ...parsedCache,
      {
        id: pokemonId,
        data: dataToCache,
      },
    ];
    await client.setAsync("individualCache", JSON.stringify(newCache));
    res.status(200).json(dataToCache);
  } catch (err) {
    res.status(404).json({
      error: "Pokemon not found",
    });
  }
});

module.exports = router;
