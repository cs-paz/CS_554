const md5 = require("blueimp-md5");
const publickey = "a51f48ecb35f6deb26662f85b9e6f67e";
const privatekey = "def1ecc0b11e8940f81718b6c49de4a47f6dcabd";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/";
const charactersUrl =
  baseUrl +
  "characters" +
  "?ts=" +
  ts +
  "&apikey=" +
  publickey +
  "&hash=" +
  hash;

const comicsUrl =
  baseUrl + "comics" + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

const seriesUrl =
  baseUrl + "series" + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

const specificCharacterUrl = (id) =>
  baseUrl +
  "characters/" +
  id +
  "?ts=" +
  ts +
  "&apikey=" +
  publickey +
  "&hash=" +
  hash;

const specificComicUrl = (id) =>
  baseUrl +
  "comics/" +
  id +
  "?ts=" +
  ts +
  "&apikey=" +
  publickey +
  "&hash=" +
  hash;

const specificSeriesUrl = (id) =>
  baseUrl +
  "series/" +
  id +
  "?ts=" +
  ts +
  "&apikey=" +
  publickey +
  "&hash=" +
  hash;

const creds = "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

const urls = {
  characters: charactersUrl,
  specificCharacter: specificCharacterUrl,
  comics: comicsUrl,
  specificComic: specificComicUrl,
  series: seriesUrl,
  specificSeries: specificSeriesUrl,
  creds,
};

export default urls;
