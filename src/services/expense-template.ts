import supabase from "@/lib/supabase";
import Response from "@/lib/response";
import ArrayTools from "@/tools/array-tools";
import type { ExpenseTemplate } from "@/types/expense";

type GetAllOptions = {
  month: number;
  userId: string;
  year: number;
};

const $ExpenseTemplate = {
  async get(id: string) {
    const { data, error } = await supabase.from("expense_templates").select("*").eq("id", id).single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseTemplate);
  },
  async getAll(options: GetAllOptions) {
    const { data, error } = await supabase
      .from("expense_templates")
      .select("*")
      .eq("user_id", options.userId)
      .or(`type.eq.monthly,type.eq.annual,and(type.eq.one-time,due_month.eq.${options.month},due_year.eq.${options.year})`)
      .order("due_day", { ascending: false });

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseTemplate[]);
  },
  async getAllIndexed(options: GetAllOptions) {
    const { data, error } = await this.getAll(options);

    if (error) {
      return Response.error(error);
    }

    const indexed = ArrayTools.indexBy(data, (template) => template.id);

    return Response.success(indexed as Record<string, ExpenseTemplate>);
  },
  async create(template: Omit<ExpenseTemplate, "id">) {
    const { data, error } = await supabase.from("expense_templates").insert(template).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseTemplate);
  },
  async update(id: string, template: Partial<Omit<ExpenseTemplate, "id" | "userId">>) {
    const { error } = await supabase.from("expense_templates").update(template).eq("id", id);

    if (error) {
      return Response.error(error);
    }

    return Response.success({ id });
  },
  async delete(id: string) {
    const { error } = await supabase.from("expense_templates").delete().eq("id", id);

    if (error) {
      return Response.error(error);
    }

    return Response.success({ id });
  },
};

export default $ExpenseTemplate;
