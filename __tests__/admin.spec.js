const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/user.model');
const baseURL = 'http://localhost:5000/api/user/admin';

describe('API User Admin', () => {
 

  it('Should create a new specialist', async () => {
    const user = new UserModel({
      first_name: 'Abdoulaye',
      last_name: 'ba',
      address: 'Kolda',
      email: 'abdoulaye@gmail.com',
      user_name: '@baabdoulaye',
      password: 'abdoulayeba123',
    });
    await user.save();
  
    const newSpecialist = {
      userId: user._id,
      professionnal_address: 'PA-ASS',
      workplace: 'unite 23',
      job: 'medecin',
    };
    const response = await request(baseURL).post('/create-specialist').send(newSpecialist);
    expect(response.status).toBe(201);
  });

  it('should return all reported posts', async () => {
    const response = await request(baseURL).get('/reported-posts');
    expect(response.status).toBe(200);
  });

  it('should return all retired accounts', async () => {
    const response = await request(baseURL).get('/retired-accounts');
    expect(response.status).toBe(200);
  });
  it('should return all no retired accounts', async () => {
    const response = await request(baseURL).get('/no-retired-accounts');
    expect(response.status).toBe(200);
  });
  it('should return all  accounts', async () => {
    const response = await request(baseURL).get('/all-accounts');
    expect(response.status).toBe(200);
  });
  it('should return all  patients', async () => {
    const response = await request(baseURL).get('/all-patients');
    expect(response.status).toBe(200);
  });
  it('should return all  followed patients', async () => {
    const response = await request(baseURL).get('/followed-patients');
    expect(response.status).toBe(200);
  });
  it('should return all  unfollowed patients', async () => {
    const response = await request(baseURL).get('/unfollowed-patients');
    expect(response.status).toBe(200);
  });
});
