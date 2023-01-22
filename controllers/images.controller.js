// const firebase = require('firebase');
// const config = {
//   apiKey: 'AIzaSyAXgs0uRZG6FgZOr1GrySo2KGPLSTqVPuw',
//   authDomain: 'o2afirebaseadmin.firebaseapp.com',
//   projectId: 'o2afirebaseadmin',
//   storageBucket: 'o2afirebaseadmin.appspot.com',
//   messagingSenderId: '641578908814',
//   appId: '1:641578908814:web:fe527f0989eedac8695ddf',
//   measurementId: 'G-KSNPWCSV3C',
// };
// firebase.initializeApp(config);
// const storage = firebase.storage();
// // const firestore = firebase.firestore(); // if using firestore
// // require('firebase/storage'); // must be required for this to work
// // const storage = firebase.storage().ref(); // create a reference to storage
// // global.XMLHttpRequest = require('xhr2'); // must be used to avoid bug
// // // Add Image to Storage and return the file path
// const storages = multer.memoryStorage();
// const upload = multer({ storage: storages }).single('file');
// app.post("/upload", upload, (req, res) =>{
//   try {
//     // Grab the file
//     const file = req.file;
//     // Format the filename
//     const timestamp = Date.now();
//     const name = file.originalname.split('.')[0];
//     const type = file.originalname.split('.')[1];
//     const fileName = `${name}_${timestamp}.${type}`;
//     // Step 1. Create reference for file name in cloud storage
//     const imageRef = storage.child(fileName);
//     // Step 2. Upload the file in the bucket storage
//     const snapshot =  imageRef.put(file.buffer);
//     // Step 3. Grab the public url
//     const downloadURL =  snapshot.ref.getDownloadURL();

//     res.send(downloadURL);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error.message);
//   }
// });
// // module.exports = {
// //   addImage,
// // };
