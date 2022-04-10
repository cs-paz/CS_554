import { gql } from "@apollo/client";

const GET_UNSPLASH_IMAGES = gql`
  query getUnsplashImages($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_BINNED_IMAGES = gql`
  query getBinnedImages {
    binnedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_USER_POSTED_IMAGES = gql`
  query getUserPostedImages {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const ADD_IMAGE_POST = gql`
  mutation addImagePost(
    $url: String!
    $description: String
    $posterName: String
  ) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const UPDATE_IMAGE_POST = gql`
  mutation updateImagePost(
    $id: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
  ) {
    updateImage(
      id: $id
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const DELETE_IMAGE_POST = gql`
  mutation deleteImagePost($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

export {
  GET_UNSPLASH_IMAGES,
  GET_BINNED_IMAGES,
  GET_USER_POSTED_IMAGES,
  ADD_IMAGE_POST,
  UPDATE_IMAGE_POST,
  DELETE_IMAGE_POST,
};
