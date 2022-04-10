import axios from "axios";
import logo from "./logo.svg";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import Home from "./pages/Home";
import MyBin from "./pages/MyBin";
import NewPost from "./pages/NewPost";
import MyPosts from "./pages/MyPosts";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <nav>
        <ul>
          <li>
            <a href="/my-bin">My Bin</a>
          </li>
          <li>
            <a href="/">Images</a>
          </li>
          <li>
            <a href="/my-posts">My Posts</a>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-bin" element={<MyBin />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/my-posts" element={<MyPosts />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
