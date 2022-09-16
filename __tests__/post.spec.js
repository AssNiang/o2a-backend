const request = require('supertest');
const app = require('../app');

const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');
const baseURL = "http://localhost:5000/api/post";


describe("API Post", () => {
   
  const user = new UserModel({
    first_name: "ami",
    last_name: "ndiaye",
    address: "Parcelles Assainies",
    email: "ndami@gmail.com",
    user_name: "@ami",
    password: "ami123"
  });
  user.save();

  const user2 = new UserModel({
    first_name: "Amy",
    last_name: "sene",
    address: "Parcelles Assainies",
    email: "amy@gmail.com",
    user_name: "@amy",
    password: "amy123"
  });

  user2.save();

  const post1 = new PostModel({
    posterId: user._id,
    message: "Welcome world !"
  });
  post1.save();
  const post2 = new PostModel({
    posterId: user2._id,
    message: "Hello Doctor !"
  });
  post2.save();
  const post3 = new PostModel({
    posterId: user2._id,
    message: "Good morning Doctor !"
  });
  post3.save();

    it("Should create a new public post and return a 201 status code", async () => {
      const response = await request(baseURL).post("/public-post").send({
        posterId: user._id,
        message: "Hellow World !"
    });
      expect(response.status).toBe(201);
    });

    it("Should create a new private post and return a 201 status code", async () => {
      const response = await request(baseURL).post("/private-post").send({
        posterId: user2._id,
        message: "Hello Doctor!",
    });
    expect(response.status).toBe(201);

    });

    it("Should update a given post and return a 200 status code", async () => {
      const response = await request(baseURL).put(`/update/${post2._id}`).send({
        message : "Good morning, doctor !"
      });
      expect(response.status).toBe(200);
    });

    it("should return all posts", async () => {
      const response = await request(baseURL).get('');
      expect(response.status).toBe(200);
    });

    it("should return all given user's posts", async () => {
      const response = await  request(baseURL).get(`/historique-posts/${user._id}`);
      expect(response.status).toBe(200);
    });

    it("should like a given post", async () => {
      
      const response = await request(baseURL).patch(`/like-post/${post1._id}`).send({
        id: user2._id,
      });
      expect(response.status).toBe(200);
    });


    it("should unlike a given post", async () => {
      const response = await request(baseURL).patch(`/unlike-post/${post1._id}`).send({
        id: user2._id,
      });
      expect(response.status).toBe(200);
    });


    it("should report a given post", async () => {
      const response = await request(baseURL).patch(`/report-post/${post1._id}`).send({
        id: user2._id,
      });
      expect(response.status).toBe(200);
    });


    it("should unreport a given post", async () => {
      const response = await request(baseURL).patch(`/unreport-post/${post1._id}`).send({
        id: user2._id,
      });
      expect(response.status).toBe(200);
    });

    it("should delete a specific  given post", async () => {
      const response = await request(baseURL).delete(`/${post1._id}`);
      expect(response.status).toBe(200);
     });
  });

