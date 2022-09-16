const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/user.model');
const baseURL = "http://localhost:5000/api/user";

const newUser = {
  first_name: 'Ass',
  last_name: 'Niang',
  address: 'Parcelles Assainies',
  email: 'nass@gmail.com',
  user_name: '@ass',
  password: 'ass123',
};
const updatedUser = {
  sexe: 'Homme',
};



describe('API User', () => {
  it('Should create a new user and return a 201 status code', async ()=> {
    const response = await request(baseURL)
      .post('/register')
      .send(newUser);
    expect(response.status).toBe(201);
  });

  it('Should update given user and return a 200 status code', async () => {
    const user1 = new UserModel({
      first_name: 'Aly',
      last_name: 'sene',
      address: 'Parcelles Assainies',
      email: 'aly@gmail.com',
      user_name: '@aly',
      password: 'aly123',
    });
    await user1.save();
    const response = await request(baseURL)
      .put(`/${user1._id}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
  });

  it('should return all users', async () => {
    const response = await request(baseURL).get('');
    expect(response.status).toBe(200);
  });

  it('should login an existing user in the database', async () => {
    const user1 = new UserModel({
      first_name: 'Amy',
      last_name: 'segne',
      address: 'Parcelles Assainies',
      email: 'amy@gmail.com',
      user_name: '@amy',
      password: 'amy123',
    });
    await user1.save();
    const response = await request(baseURL).post('/login').send({
      email: 'amy@gmail.com',
      password: 'amy123',
    });
    expect(response.status).toBe(200);
  });

  it('should return a specific user given his id with status code 200', async () => {
    const user1 = new UserModel({
      first_name: 'Amy',
      last_name: 'sene',
      address: 'Parcelles Assainies',
      email: 'ammyh@gmail.com',
      user_name: '@ammy',
      password: 'ammny123',
    });
    await user1.save();
    const response = await request(baseURL).get(`/${user1._id}`);
    expect(response.status).toBe(200);
  });

  it('should be able to delete user', async () => {
    const user1 = new UserModel({
      first_name: 'Ami',
      last_name: 'sene',
      address: 'Parcelles Assainies',
      email: 'amih@gmail.com',
      user_name: '@ami',
      password: 'ami123',
    });
    await user1.save();
    const response = await request(baseURL).delete(`/${user1._id}`);
    expect(response.status).toBe(200);
  });
});
