// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
require('dotenv').config({ path: '../config/.env' });
const initializeApp = require('firebase/app');
// import { getStorage } from 'firebase/storage';
const getStorage = require('firebase/storage');
const ref = require('firebase/storage');
const uploadString = require('firebase/storage');
const getDownloadURL = require('firebase/storage');
// import { getStorage, ref, uploadBytes } from 'firebase/storage';
// Create a root reference
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  // databaseURL: DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};
const app = initializeApp.initializeApp(firebaseConfig);
const storage = getStorage.getStorage(app);

exports.uploadFileToFirebase = async (file) => {
  const storageRef = ref.ref(storage, file.filename);
  // Raw string is the default if no format is provided
  const message = 'This is my message.';
  uploadString.uploadString(storageRef, message).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
};

exports.getUrlFromFirebaseStirage = async (file) => {
  getDownloadURL(ref(storage, file.filename))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      // // Or inserted into an <img> element
      // const img = document.getElementById('myimg');
      // img.setAttribute('src', url);
    })
    .catch((error) => {
      // Handle any errors
    });
};
