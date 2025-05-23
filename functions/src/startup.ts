import {initializeApp} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const adminApp = initializeApp()
export const db = getFirestore();