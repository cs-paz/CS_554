import axios from "axios";
import logo from "./logo.svg";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Characters from "./pages/characters/Characters";
import SpecificCharacter from "./pages/characters/Specific";
import Comics from "./pages/comics/Comics";
import SpecificComic from "./pages/comics/Specific";
import Series from "./pages/series/Series";
import SpecificSeries from "./pages/series/Specific";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters/page/:page" element={<Characters />} />
        <Route path="/characters/:id" element={<SpecificCharacter />} />
        <Route path="/comics/page/:page" element={<Comics />} />
        <Route path="/comics/:id" element={<SpecificComic />} />
        <Route path="/series/page/:page" element={<Series />} />
        <Route path="/series/:id" element={<SpecificSeries />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
