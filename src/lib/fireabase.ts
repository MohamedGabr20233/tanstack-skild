import { connectorConfig } from "#/dataconnect-generated"
import {getApp, getApps, initializeApp} from "firebase/app"
import { getDataConnect } from "firebase/data-connect"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId : import.meta.env.VITE_FIREBASE_APP_ID,   
}


export const firebaseApp= !getApps().length ?  initializeApp(firebaseConfig) : getApp()

export const dataConnected = getDataConnect(firebaseApp ,connectorConfig)
