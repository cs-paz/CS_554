import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_UNSPLASH_IMAGES,
  GET_BINNED_IMAGES,
  UPDATE_IMAGE_POST,
} from "../queries";

const isBinnedImage = (binnedImages, unsplashImage) => {
  if (!binnedImages) {
    return false;
  }
  if (binnedImages?.length === 0) {
    return false;
  }
  const binnedImage = binnedImages.find(
    (image) => image.id === unsplashImage.id && image.binned
  );
  return binnedImage ? true : false;
};

const Home = () => {
  const [page, setPage] = useState(1);
  const {
    loading,
    error,
    data,
    refetch: unsplashRefetch,
  } = useQuery(GET_UNSPLASH_IMAGES, {
    fetchPolicy: "cache-and-network",
    variables: { pageNum: page },
  });
  if (error) {
    console.log(error);
  }
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

  const readyToRender =
    !loading && !binLoading && !error && !binError && data && binData !== null;

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
    unsplashRefetch();
  }, [page]);

  if (data) console.log(data.unsplashImages);

  return (
    <div>
      {readyToRender ? (
        <>
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
              setPage(page + 1);
            }}
          >
            <p>Get More</p>
          </div>
          {data.unsplashImages.map((image) => (
            <div key={image.id}>
              {image.description && <p>{image.description}</p>}
              {image.posterName && <p>an image by: {image.posterName}</p>}
              <img src={image.url} alt={image.posterName} width={600} />
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
                    binned: !isBinnedImage(binData?.binnedImages, image),
                  });
                }}
              >
                {!isBinnedImage(binData?.binnedImages, image) ? (
                  <p>Add to Bin</p>
                ) : (
                  <p>Remove from Bin</p>
                )}
              </div>
            </div>
          ))}
          )
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default Home;
