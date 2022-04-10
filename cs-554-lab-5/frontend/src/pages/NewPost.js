import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_IMAGE_POST } from "../queries";

const imageExists = (image_url) => {
  var http = new XMLHttpRequest();

  http.open("HEAD", image_url, false);
  http.send();

  return http.status != 404;
};

const NewPost = ({ setNewPost }) => {
  const [addImagePost] = useMutation(ADD_IMAGE_POST);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [posterName, setPosterName] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [invalid, setInvalid] = useState(false);

  let _url, _description, _posterName;

  useEffect(() => {
    if (uploadImage) {
      const variables = {
        url,
        description,
        posterName,
      };
      addImagePost({ variables });
      setUploadSuccess(true);
      setUploadImage(false);
      setNewPost(true);
    }
  }, [uploadImage]);

  return (
    <div>
      <h1>Create a Post</h1>
      <form>
        <div>
          <label>Image URL</label>
          <input
            type="text"
            onChange={(e) => {
              e.preventDefault();
              setUrl(e.target.value);
            }}
            ref={(input) => {
              _url = input;
            }}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            onChange={(e) => {
              e.preventDefault();
              setDescription(e.target.value);
            }}
            ref={(input) => {
              _description = input;
            }}
          />
        </div>
        <div>
          <label>Poster Name</label>
          <input
            type="text"
            onChange={(e) => {
              e.preventDefault();
              setPosterName(e.target.value);
            }}
            ref={(input) => {
              _posterName = input;
            }}
          />
        </div>
        <div
          style={{
            height: "50px",
            width: "150px",
            backgroundColor: "lightgrey",
            marginTop: 20,
            border: "1px solid black",
            borderRadius: "8px",
            textAlign: "center",
          }}
          onClick={() => {
            if (
              imageExists(url) &&
              url.length > 0 &&
              description.length > 0 &&
              posterName.length > 0
            ) {
              setUploadImage(true);
              setInvalid(false);
            } else {
              setInvalid(true);
            }
            _url.value = "";
            _description.value = "";
            _posterName.value = "";
          }}
        >
          <p>Submit</p>
        </div>
      </form>
      {uploadSuccess && <p>Upload Successful!</p>}
      {invalid && (
        <p>One or more fields are invalid. Ensure Image URL exists.</p>
      )}
    </div>
  );
};

export default NewPost;
