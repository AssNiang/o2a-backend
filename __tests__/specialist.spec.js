const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');
const SpecialistModel = require('../models/specialist.model');
const AllergyModel = require('../models/allergie.model');
const baseURL = "http://localhost:5000/api/user/specialist";

const editedFile = {
  allergy_name: "Allergies aux oeufs",
  description: "je me gratte la main souvent",
  clinic_sign: "du n'importe quoi",
  symptom: "gratter le corps"
};

const user = new UserModel({
first_name: "hassan",
last_name: "ba",
address: "Parcelles Assainies",
email: "bahas@gmail.com",
user_name: "@hassan",
password: "hba123",
is_patient: true
});
user.save();

const user1 = new UserModel({
first_name: "hassane",
last_name: "Ba",
address: "Parcelles Assainies",
email: "bahase@gmail.com",
user_name: "@hassane",
password: "haba123",
is_specialist: true
});
user1.save();

const specialist = new SpecialistModel({
userId: user1._id,
matricule: "o2a345678hassane1234021",
professionnal_address: "Parcelles Assainies",
workplace:"Fatick",
job: "medecin",
});
specialist.save();
const post = new PostModel({
posterId: user._id,
message: "Welcome world !"
});
post.save();

const file = new AllergyModel({
postId:post._id, 
posterId: user._id,
specialistId: user1._id,
});

const newAllergyFile = {
postId: post._id, 
posterId: user._id,
specialistId: specialist._id,
};
describe("API User Admin", () => {
    it("Should create a new allergy file", async () => {
      const response = await request(baseURL).post("/create-file").send(newAllergyFile);
      expect(response.status).toBe(201);
    });

    it("Should edit an existing allergy file", async () => {
      const response = await request(baseURL).post(`/edit-file/${specialist._id}`).send(editedFile);
      expect(response.status).toBe(200);
    });
   
    it("should return all patients", async () => {
      const response = await request(baseURL).get("/all-patients");
      expect(response.status).toBe(200);
    });

    it("should return a disired patient", async () => {
      const response = await request(baseURL).get(`/patient/${user._id}`);
      expect(response.status).toBe(200);
    });

    it("should return all files historic", async () => {
      const response = await request(baseURL).get("/get-all-file");
      expect(response.status).toBe(200);
    });

    it("should return a specific file historic", async () => {
      const response = await request(baseURL).get(`/get-file/${file._id}`);
      expect(response.status).toBe(200);
    });

    it("should return all  accounts", async () => {
      const response = await request(baseURL).get("/all-accounts");
      expect(response.status).toBe(200);
    });

    it("should make a specialist follows a patient", async () => {
      const response = await request(baseURL).get(`/follow-patient/${specialist._id}`).send({
          idToFollow: user._id
      });
      expect(response.status).toBe(200);
    });

    it("should make a specialist unfollows a patient", async () => {
      const response = await request(baseURL).get(`/unfollow-patient/${specialist._id}`).send({
        idToUnFollow: user._id
    });
      expect(response.status).toBe(200);
    });


    it("should delete an existing file", async () => {
      const response = await request(baseURL).delete(`/delete-file/${file._id}`);
      expect(response.status).toBe(200);
    });
  });

