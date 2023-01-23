// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
require('dotenv').config({ path: '../config/.env' });
const initializeApp = require('firebase/app');
// import { getStorage } from 'firebase/storage';
const getStorage = require('firebase/storage');
const ref = require('firebase/storage');
const uploadString = require('firebase/storage');
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
// const imagesRef = ref(storage, 'profiles');
// 'file' comes from the Blob or File API
// uploadBytes(storageRef, file).then((snapshot) => {
//   console.log('Uploaded a blob or file!');
// });
// Initialize Cloud Storage and get a reference to the service
// const storage = getStorage(app);
// firebase.initializeApp(firebaseConfig);
// const storage = getStorage.getStorage(app);

exports.uploadFileToFirebase = async (file) => {
  //   console.log(file);
  // Format the filename
  // const timestamp = Date.now();
  // const name = file.originalname.split('.')[0];
  // const type = file.originalname.split('.')[1];
  // const fileName = `${name}_${timestamp}.${type}`;
  // Step 1. Create reference for file name in cloud storage
  // Create file metadata including the content type
  //   /** @type {any} */
  //   const metadata = {
  //     contentType: 'image/jpg',
  //   };
  const storageRef = ref.ref(storage, file.filename);
  // Raw string is the default if no format is provided
  const message = 'This is my message.';
  uploadString.uploadString(storageRef, message).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
  //   storage.imageRef.filename = file.filename;
  // Step 2. Upload the file in the bucket storage
  //   storage.imageRef.buffer = file.buffer;
  // Step 3. Grab the public url
  //   const downloadURL = snapshot.ref.getDownloadURL();
  //   return downloadURL;
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
