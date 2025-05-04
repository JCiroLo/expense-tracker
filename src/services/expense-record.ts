import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { assignTypes, db } from "@/lib/firebase";
import Response from "@/lib/response";
import { ExpenseRecord } from "@/types/expense";

const firebase = {
  collection: collection(db, "expense-records").withConverter(assignTypes<ExpenseRecord>()),
  doc: (id: string) => doc(db, "expense-records", id),
};

const $ExpenseRecord = {
  async get(id: string) {
    const snapshot = await getDoc(firebase.doc(id));

    return Response.success(snapshot.data());
  },
  async getByTemplate({ templateId, userId }: { templateId: string | string[]; userId: string }) {
    const q = query(
      firebase.collection,
      where("userId", "==", userId),
      where("templateId", Array.isArray(templateId) ? "in" : "==", templateId)
    );

    const snapshot = await getDocs(q);

    return Response.success(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  },
  async getAll({ userId }: { userId: string }) {
    const q = query(firebase.collection, where("userId", "==", userId));

    const snapshot = await getDocs(q);

    return Response.success(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  },
  async create(template: Omit<ExpenseRecord, "id">) {
    const docRef = await addDoc(firebase.collection, template);

    return Response.success({ id: docRef.id, ...template });
  },
  async update(id: string, template: Partial<Omit<ExpenseRecord, "id">>) {
    await updateDoc(firebase.doc(id), template);

    return Response.success({ id, ...template });
  },
  async delete(id: string) {
    await deleteDoc(firebase.doc(id));

    return Response.success({ id });
  },
};

export default $ExpenseRecord;
