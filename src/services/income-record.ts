import supabase from "@/lib/supabase";
import Response from "@/lib/response";
import type { IncomeRecord } from "@/types/income";

type GetByTemplateParams = {
  templateId: string | string[];
  userId: string;
  month: number;
  year: number;
};

const $IncomeRecord = {
  async get(id: string) {
    const { data, error } = await supabase.from("income_records").select("*").eq("id", id).single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeRecord);
  },
  async getAll({ userId }: { userId: string }) {
    const { data, error } = await supabase.from("income_records").select("*").eq("user_id", userId);

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeRecord[]);
  },
  async getByTemplate({ templateId, userId, month, year }: GetByTemplateParams) {
    let query = supabase.from("income_records").select("*").eq("user_id", userId).eq("paid_at_month", month).eq("paid_at_year", year);

    if (Array.isArray(templateId)) {
      query = query.in("template_id", templateId);
    } else {
      query = query.eq("template_id", templateId);
    }

    const { data, error } = await query;

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeRecord[]);
  },
  async create(record: Omit<IncomeRecord, "created_at" | "id">) {
    const { data, error } = await supabase.from("income_records").insert(record).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeRecord);
  },
  async update(id: string, record: Partial<Omit<IncomeRecord, "id">>) {
    const { data, error } = await supabase.from("income_records").update(record).eq("id", id).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeRecord);
  },
  async delete(id: string) {
    const { error } = await supabase.from("income_records").delete().eq("id", id);

    if (error) {
      return Response.error(error);
    }

    return Response.success({ id });
  },
};

export default $IncomeRecord;
