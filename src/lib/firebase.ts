import { initializeApp } from "firebase/app";
import { DocumentData, getFirestore, QueryDocumentSnapshot } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDr4qZWH8amV2QTOo8Ma4vR7VZiwmmCzPo",
  authDomain: "expense-tracker-87f3e.firebaseapp.com",
  projectId: "expense-tracker-87f3e",
  storageBucket: "expense-tracker-87f3e.firebasestorage.app",
  messagingSenderId: "126054778253",
  appId: "1:126054778253:web:b1bc125c070e39aed6a9c4",
  measurementId: "G-V9WJS5DDY2",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

function assignTypes<T extends object>() {
  return {
    toFirestore(doc: T): DocumentData {
      return doc;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return snapshot.data()! as T;
    },
  };
}

export { db, analytics, auth, assignTypes };
