import axios from "axios";
import logo from "./logo.svg";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Pokemon from "./pages/pokemon/Pokemon";
import Specific from "./pages/pokemon/Specific";
import NotFound from "./pages/NotFound";
import Trainers from "./pages/trainers/Trainers";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/page/:page" element={<Pokemon />} />
        <Route path="/pokemon/:id" element={<Specific />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
