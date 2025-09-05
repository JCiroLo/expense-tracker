import supabase from "@/lib/supabase";
import Response from "@/lib/response";
import type { ExpenseRecord } from "@/types/expense";

type GetByTemplateParams = {
  templateId: string | string[];
  userId: string;
  month: number;
  year: number;
};

const $ExpenseRecord = {
  async get(id: string) {
    const { data, error } = await supabase.from("expense_records").select("*").eq("id", id).single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseRecord);
  },
  async getAll({ userId }: { userId: string }) {
    const { data, error } = await supabase.from("expense_records").select("*").eq("user_id", userId);

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseRecord[]);
  },
  async getByTemplate({ templateId, userId, month, year }: GetByTemplateParams) {
    let query = supabase.from("expense_records").select("*").eq("user_id", userId).eq("paid_at_month", month).eq("paid_at_year", year);

    if (Array.isArray(templateId)) {
      query = query.in("template_id", templateId);
    } else {
      query = query.eq("template_id", templateId);
    }

    const { data, error } = await query;

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseRecord[]);
  },
  async create(record: Omit<ExpenseRecord, "created_at" | "id">) {
    const { data, error } = await supabase.from("expense_records").insert(record).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseRecord);
  },
  async update(id: string, record: Partial<Omit<ExpenseRecord, "id">>) {
    const { data, error } = await supabase.from("expense_records").update(record).eq("id", id).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseRecord);
  },
  async delete(id: string) {
    const { error } = await supabase.from("expense_records").delete().eq("id", id);

    if (error) {
      return Response.error(error);
    }

    return Response.success({ id });
  },
};

export default $ExpenseRecord;
