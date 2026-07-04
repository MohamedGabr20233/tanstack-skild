import {initializeApp} from "firebase/app"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.FIREBASE_PROJECT_ID,
    appId : import.meta.env.FIREBASE_APP_ID,   
}


export const firebaseApp= initializeApp(firebaseConfig)