const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');
const CommentModel = require('../models/comment.model');
const baseURL = "http://localhost:5000/api/comment";




describe("API Comment Post", () => {

  const user = new UserModel({
    first_name: "lassan",
    last_name: "barry",
    address: "Thies",
    email: "lbarry@gmail.com",
    user_name: "@lansannam",
    password: "barry123",
    is_patient: true
  });
  user.save();
  
  const user1 = new UserModel({
    first_name: "Anna",
    last_name: "wade",
    address: "Mbour",
    email: "ana@gmail.com",
    user_name: "@awadw",
    password: "awade123"
  });
  user1.save();

  const post1 = new PostModel({
    posterId: user1._id,
    message: "Welcome to my house!"
  });
  post1.save();

  const post = new PostModel({
    posterId: user._id,
    message: "Welcome world !"
  });
  post.save();


    const newComment = {
      commenterId: user1._id,
      text : "Merci!"
    };
  
    const updatedComment = {
      text : "Merci beaucoup !"
    };

    const comment = new CommentModel({
      postId: post._id,
      commenterId: user._id,
      text : "Merci les amis!"
    });
    comment.save();
   
    it("Should comment a given post", async () => {
      const response = await request(baseURL).post(`/comment/${post._id}`).send(newComment);
      expect(response.status).toBe(201);
    });

    it("Should edit an existing given comment", async () => {
      const response = await request(baseURL).patch(`/edit-comment/${comment._id}`).send(updatedComment);
      expect(response.status).toBe(200);
    });

    it("should return all comments of a given post", async () => {
      const response = await request(baseURL).get(`/${post._id}`);
      expect(response.status).toBe(200);
    });
  
    it("should like a given comment", async () => {
      const response = await request(baseURL).patch(`/like-comment/${comment._id}`).send({
        id: user1._id,
      });
      expect(response.status).toBe(200);
    });

    it("should unlike a given comment", async () => {
      const response = await request(baseURL).patch(`/unlike-comment/${post._id}`).send({
        id: user1._id,
      });
      expect(response.status).toBe(200);
    });

    it("should report a given comment", async () => {
      const response = await request(baseURL).patch(`/report-comment/${comment._id}`).send({
        id: user1._id,
      });
      expect(response.status).toBe(200);
    });

    it("should unreport a given post", async () => {
      const response = await request(baseURL).patch(`/unreport-comment/${comment._id}`).send({
        id: user1._id,
      });
      expect(response.status).toBe(200);
    });

    it("should delete a specific  given comment", async () => {
      const response = await request(baseURL).delete(`/${comment._id}`);
      expect(response.status).toBe(200);
     });
  });

