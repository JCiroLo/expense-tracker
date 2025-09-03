import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { assignTypes, db } from "@/lib/firebase";
import Response from "@/lib/response";
import type { ExpenseCategory } from "@/types/expense";

const firebase = {
  collection: collection(db, "expense-categories").withConverter(assignTypes<ExpenseCategory>()),
  doc: (id: string) => doc(db, "expense-categories", id),
};

const $ExpenseCategory = {
  async get(id: string) {
    const snapshot = await getDoc(firebase.doc(id));

    return Response.success(snapshot.data());
  },
  async getAll({ userId }: { userId: string }) {
    const q = query(firebase.collection, where("userId", "==", userId), orderBy("name", "asc"));

    const snapshot = await getDocs(q);

    return Response.success(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  },
  async create(category: Omit<ExpenseCategory, "id">) {
    const docRef = await addDoc(firebase.collection, category);

    return Response.success({ id: docRef.id, ...category });
  },
  async update(id: string, category: Partial<Omit<ExpenseCategory, "id" | "userId">>) {
    await updateDoc(firebase.doc(id), category);

    return Response.success({ id });
  },
  async delete(id: string) {
    await deleteDoc(firebase.doc(id));

    return Response.success({ id });
  },
};

export default $ExpenseCategory;
