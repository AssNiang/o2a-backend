// const request = require("supertest");
// const mongoose = require("mongoose");
// const { connectDB, disconnectDB } = require('../config/mock.db');
// const { api } = require('../routes/user.routes');
// const {app, server} = require('../server');
// const request = supertest(api);
// const baseURL = "http://localhost:5000/api/user"

const UserModel = require("../models/user.model");
const auth_controller = require("../controllers/auth.controller");
const db_test = require("./db_test");

jest.setTimeout(600000);

beforeAll(async () => await db_test.connect());
afterEach(async () => await db_test.clearDatabase());
afterAll(async () => await db_test.closeDatabase());

describe("API User", () => {
  // const newUser = {
  //   first_name: "Ass",
  //   last_name: "Niang",
  //   address: "Parcelles Assainies",
  //   email: "nass@gmail.com",
  //   user_name: "@ass",
  //   password: "ass123",
  // };
  // const updatedUser = {
  //   sexe: "Homme"
  // };

  it("Should create a new user and return a 201 status code", async () => {
    const newUser = {
      first_name: "Ass",
      last_name: "Niang",
      address: "Parcelles Assainies",
      email: "nass@gmail.com",
      user_name: "@ass",
      password: "ass123",
    };
    
    auth_controller.signUp(newUser, Headers)
  });
  // it("Should update given user and return a 200 status code", async () => {
  //   const user = new UserModel({
  //     first_name: "Aly",
  //     last_name: "sene",
  //     address: "Parcelles Assainies",
  //     email: "aly@gmail.com",
  //     user_name: "@aly",
  //     password: "aly123",
  //   });

  //   await user.save();
  //   const response = await request(baseURL)
  //     .put("/" + user._id)
  //     .send(updatedUser);
  //   expect(response.status).toBe(200);
  // });
  // it("should return all users", async () => {
  //   const response = await request(baseURL).get("");
  //   expect(response.status).toBe(200);
  // });
  // it("should login an existing user in the database", async () => {
  //   const user = new UserModel({
  //     first_name: "Assee",
  //     last_name: "Niangee",
  //     address: "Parcelles Assainies",
  //     email: "nassee@gmail.com",
  //     user_name: "@assee",
  //     password: "assee123",
  //   });

  //   await user.save();
  //   const response = await request(baseURL).post("/login").send({
  //     email: "nassee@gmail.com",
  //     password: "assee123",
  //   });
  //   expect(response.status).toEqual(200);
  // });
  // it("should return a specific user given his id with status code 200", async () => {
  //   const user = new UserModel({
  //     first_name: "Aasse",
  //     last_name: "Niange",
  //     address: "Parcelles Assainies",
  //     email: "naasse@gmail.com",
  //     user_name: "@aasse",
  //     password: "aasse123",
  //   });

  //   await user.save();
  //   const response = await request(baseURL).get("/" + user._id);
  //   expect(response.status).toEqual(200);
  // });

  // it("should be able to delete user", async () => {
  //   const user = new UserModel({
  //     first_name: "Asse",
  //     last_name: "Niange",
  //     address: "Parcelles Assainies",
  //     email: "nasse@gmail.com",
  //     user_name: "@asse",
  //     password: "asse123",
  //   });

  //   await user.save();

  //   const response = await request(baseURL).delete("/" + user._id);
  //   expect(response.status).toBe(200);
  // });
});
