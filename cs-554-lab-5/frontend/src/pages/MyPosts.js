import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BINNED_IMAGES, UPDATE_IMAGE_POST } from "../queries";
import NewPost from "./NewPost";

const MyPosts = () => {
  const {
    loading: binLoading,
    error: binError,
    data: binData,
    refetch: binRefetch,
  } = useQuery(GET_BINNED_IMAGES, {
    fetchPolicy: "cache-and-network",
  });

  const [updateImagePost] = useMutation(UPDATE_IMAGE_POST);
  const [updateBin, setUpdateBin] = useState({});
  const [newPost, setNewPost] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

  const readyToRender = !binLoading && !binError && binData !== null;

  useEffect(() => {
    if (updateBin.id) {
      const { id, url, posterName, description, userPosted, binned } =
        updateBin;
      const variables = {
        id,
        url,
        posterName,
        description,
        userPosted,
        binned,
      };
      updateImagePost({ variables });
      setUpdateBin({});
    }
    binRefetch();
  }, [updateBin]);

  useEffect(() => {
    if (newPost) {
      binRefetch();
      setNewPost(false);
    }
  }, [newPost]);
  return (
    <div>
      {readyToRender ? (
        <>
          <div>
            {displayForm ? (
              <>
                <NewPost setNewPost={setNewPost} />
                <div
                  style={{
                    height: "50px",
                    width: "150px",
                    marginTop: "20px",
                    backgroundColor: "lightgrey",
                    marginBottom: 40,
                    border: "1px solid black",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                  onClick={() => setDisplayForm(false)}
                >
                  Close Form
                </div>
              </>
            ) : (
              <div
                style={{
                  height: "50px",
                  width: "150px",
                  backgroundColor: "lightgrey",
                  marginBottom: 40,
                  border: "1px solid black",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
                onClick={() => setDisplayForm(true)}
              >
                Upload Post
              </div>
            )}
          </div>
          {binData.binnedImages
            .filter((_image) => _image.userPosted)
            .map((image) => (
              <div key={image.id}>
                <img src={image.url} alt={image.posterName} width={600} />
                {image.posterName && <p>Poster Name: {image.posterName}</p>}
                {image.description && <p>Description: {image.description}</p>}
                <div
                  style={{
                    height: "50px",
                    width: "150px",
                    backgroundColor: "lightgrey",
                    marginBottom: 40,
                    border: "1px solid black",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    setUpdateBin({
                      id: image.id,
                      url: image.url,
                      posterName: image.posterName,
                      description: image.description,
                      userPosted: image.userPosted,
                      binned: false,
                    });
                  }}
                >
                  <p>Remove from Bin</p>
                </div>
              </div>
            ))}
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default MyPosts;
