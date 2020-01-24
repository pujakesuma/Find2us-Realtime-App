import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCzirmTrfNAPkOp7QqwDUpFC6FkF1rSLbE',
  authDomain: 'find2us-310796.firebaseapp.com',
  databaseURL: 'https://find2us-310796.firebaseio.com',
  projectId: 'find2us-310796',
  storageBucket: 'find2us-310796.appspot.com',
  messagingSenderId: '1004420086305',
  appId: '1:1004420086305:web:9136e910629e0ab02f0160',
  measurementId: 'G-XHRQ4629QR',
};

let app = firebase.initializeApp(firebaseConfig);

export const Database = app.database();
export const Auth = app.auth();
