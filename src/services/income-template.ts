import supabase from "@/lib/supabase";
import Response from "@/lib/response";
import ArrayTools from "@/tools/array-tools";
import type { IncomeTemplate } from "@/types/income";

type GetAllOptions = {
  month: number;
  userId: string;
  year: number;
};

const $IncomeTemplate = {
  async get(id: string) {
    const { data, error } = await supabase.from("income_templates").select("*").eq("id", id).single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeTemplate);
  },
  async getAll(options: GetAllOptions) {
    const { data, error } = await supabase
      .from("income_templates")
      .select("*")
      .eq("user_id", options.userId)
      .or(`type.eq.monthly,type.eq.annual,and(type.eq.one-time,due_month.eq.${options.month},due_year.eq.${options.year})`)
      .order("due_day", { ascending: false });

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeTemplate[]);
  },
  async getAllIndexed(options: GetAllOptions) {
    const { data, error } = await this.getAll(options);

    if (error) {
      return Response.error(error);
    }

    const indexed = ArrayTools.indexBy(data, (template) => template.id);

    return Response.success(indexed as Record<string, IncomeTemplate>);
  },
  async create(template: Omit<IncomeTemplate, "id">) {
    const { data, error } = await supabase.from("income_templates").insert(template).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as IncomeTemplate);
  },
  async update(id: string, template: Partial<Omit<IncomeTemplate, "id" | "userId">>) {
    const { error } = await supabase.from("income_templates").update(template).eq("id", id);

    if (error) {
      return Response.error(error);
    }

    return Response.success({ id });
  },
  async delete(id: string) {
    const { error } = await supabase.from("income_templates").delete().eq("id", id);

    if (error) {
      return Response.error(error);
    }

    return Response.success({ id });
  },
};

export default $IncomeTemplate;
