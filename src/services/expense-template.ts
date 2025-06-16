import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { assignTypes, db } from "@/lib/firebase";
import Response from "@/lib/response";
import { ExpenseTemplate } from "@/types/expense";

const firebase = {
  collection: collection(db, "expense-templates").withConverter(assignTypes<ExpenseTemplate>()),
  doc: (id: string) => doc(db, "expense-templates", id),
};

const $ExpenseTemplate = {
  async get(id: string) {
    const snapshot = await getDoc(firebase.doc(id));

    return Response.success(snapshot.data());
  },
  async getAll({ userId }: { userId: string }) {
    const q = query(firebase.collection, where("userId", "==", userId), orderBy("dueDay", "desc"));

    const snapshot = await getDocs(q);

    return Response.success(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  },
  async create(template: Omit<ExpenseTemplate, "id">) {
    const docRef = await addDoc(firebase.collection, template);

    return Response.success({ id: docRef.id, ...template });
  },
  async update(id: string, template: Partial<Omit<ExpenseTemplate, "id" | "userId">>) {
    await updateDoc(firebase.doc(id), template);

    return Response.success({ id });
  },
  async delete(id: string) {
    await deleteDoc(firebase.doc(id));

    return Response.success({ id });
  },
};

export default $ExpenseTemplate;
