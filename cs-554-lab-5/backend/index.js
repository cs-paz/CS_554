const { ApolloServer, gql } = require("apollo-server");
const { createApi } = require("unsplash-js");
const uuid = require("uuid");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
const fetch = require("node-fetch");
global.fetch = fetch;

const ACCESS_KEY = "lLt8ZJ9gxR_XfxJmpOhdCBrwi5aZrknHJ3HmxoqETso";
const SECRET_KEY = "IifwW-5PLmtNQ97EUk12TdZXkel1e6Zwn2ASj4FfTZE";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const unsplash = createApi({
  accessKey: ACCESS_KEY,
  secret: SECRET_KEY,
});

const typeDefs = gql`
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }

  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

const addPostToRedisDB = async ({ post, db, name }) => {
  let _db = JSON.parse(db);
  if (!_db?.length > 0) {
    _db = [];
  }
  // add post to array
  _db.push(post);
  await client.setAsync(name, JSON.stringify(_db));
};

const updatePostInRedisDB = async ({ post, db, name }) => {
  const _db = JSON.parse(db);
  const index = _db.findIndex((p) => p.id === post.id);
  _db[index] = post;
  await client.setAsync(name, JSON.stringify(_db));
};

const deletePostFromRedisDB = async ({ id, db, name }) => {
  const _db = JSON.parse(db);
  const index = _db.findIndex((p) => p.id === id);
  const post = _db.splice(index, 1);
  await client.setAsync(name, JSON.stringify(_db));
  return post;
};

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      console.log(args);
      const response = await unsplash.photos.list({
        page: args?.pageNum ? args.pageNum : 1,
      });
      const images = response.response.results;
      return images.map((image) => {
        return {
          id: image.id,
          url: image.urls.regular,
          posterName: image.user.name,
          description: image.description,
          userPosted: false,
          binned: false,
        };
      });
    },
    binnedImages: async () => {
      const db = await client.getAsync("binnedImages");
      if (!db) {
        return [];
      }
      return JSON.parse(db);
    },
    userPostedImages: async () => {
      const db = await client.getAsync("binnedImages");
      return JSON.parse(db).filter((image) => image.userPosted);
    },
  },
  Mutation: {
    uploadImage: async (parent, args) => {
      const binnedImages = await client.getAsync("binnedImages");
      const post = {
        id: uuid.v4(),
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: true,
        binned: true,
      };
      await addPostToRedisDB({
        post,
        db: binnedImages,
        name: "binnedImages",
      });
      return post;
    },
    updateImage: async (parent, args) => {
      const binnedImages = await client.getAsync("binnedImages");
      const _binnedImages = JSON.parse(binnedImages);
      const post =
        _binnedImages?.length > 0
          ? _binnedImages.find((image) => image.id === args.id)
          : false;
      if (post) {
        console.log("post exists in the bin");
        if (args.url) {
          post.url = args.url;
        }
        if (args.posterName) {
          post.posterName = args.posterName;
        }
        if (args.description) {
          post.description = args.description;
        }
        if (args.userPosted !== post.userPosted) {
          post.userPosted = args.userPosted;
        }
        if (args.binned !== post.binned) {
          post.binned = args.binned;
          console.log("removing post from bin");
          if (!args.binned) {
            await deletePostFromRedisDB({
              id: post.id,
              db: binnedImages,
              name: "binnedImages",
            });
            return post;
          }
        }
        await updatePostInRedisDB({
          post,
          db: binnedImages,
          name: "binnedImages",
        });
        return post;
      } else {
        console.log("adding new post to bin ");
        const newPost = {
          id: args.id,
          url: args.url,
          posterName: args.posterName,
          description: args.description,
          userPosted: args.userPosted,
          binned: true,
        };
        console.log(newPost);
        await addPostToRedisDB({
          post: newPost,
          db: binnedImages,
          name: "binnedImages",
        });
        return newPost;
      }
    },
    deleteImage: async (parent, args) => {
      const binnedImages = await client.getAsync("binnedImages");
      return await deletePostFromRedisDB({
        id: args.id,
        db: binnedImages,
        name: "binnedImages",
      });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
