import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { assignTypes, db } from "@/lib/firebase";
import Response from "@/lib/response";
import { ExpenseRecord } from "@/types/expense";

type GetByTemplateParams = {
  templateId: string | string[];
  userId: string;
  month: number;
  year: number;
};

const firebase = {
  collection: collection(db, "expense-records").withConverter(assignTypes<ExpenseRecord>()),
  doc: (id: string) => doc(db, "expense-records", id),
};

const $ExpenseRecord = {
  async get(id: string) {
    const snapshot = await getDoc(firebase.doc(id));

    return Response.success(snapshot.data());
  },
  async getByTemplate({ templateId, userId, month, year }: GetByTemplateParams) {
    const q = query(
      firebase.collection,
      where("userId", "==", userId),
      where("templateId", Array.isArray(templateId) ? "in" : "==", templateId),
      where("paidAtMonth", "==", month),
      where("paidAtYear", "==", year)
    );

    const snapshot = await getDocs(q);

    return Response.success(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  },
  async getAll({ userId }: { userId: string }) {
    const q = query(firebase.collection, where("userId", "==", userId));

    const snapshot = await getDocs(q);

    return Response.success(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  },
  async create(record: Omit<ExpenseRecord, "id">) {
    const docRef = await addDoc(firebase.collection, record);

    return Response.success({ id: docRef.id, ...record });
  },
  async update(id: string, record: Partial<Omit<ExpenseRecord, "id">>) {
    await updateDoc(firebase.doc(id), record);

    return Response.success({ id, ...record });
  },
  async delete(id: string) {
    await deleteDoc(firebase.doc(id));

    return Response.success({ id });
  },
  async createOneTimePayment({ userId, title, amount }: { userId: string; title: string; amount: number }) {
    const now = new Date();
    const record: Omit<ExpenseRecord, "id"> = {
      templateId: null,
      type: "one-time",
      userId,
      paidAtYear: now.getFullYear(),
      paidAtMonth: now.getMonth(),
      paidAt: now,
      title,
      amount,
    };

    return this.create(record);
  },
};

export default $ExpenseRecord;
