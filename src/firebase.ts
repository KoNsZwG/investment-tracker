// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDSRYpFBIsg8Bia-JLfNdHxR0z3_SjP1ic',
  authDomain: 'investment-tracker-df708.firebaseapp.com',
  projectId: 'investment-tracker-df708',
  storageBucket: 'investment-tracker-df708.appspot.com',
  messagingSenderId: '302387048039',
  appId: '1:302387048039:web:5c9f11216eca1bd1956ec2',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

console.log(getFirestore(app))
export const auth = getAuth(app)
export const db = getFirestore(app)
