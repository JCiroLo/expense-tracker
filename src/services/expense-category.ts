import supabase from "@/lib/supabase";
import Response from "@/lib/response";
import type { ExpenseCategory } from "@/types/expense";

const $ExpenseCategory = {
  async get(id: string) {
    const { data, error } = await supabase.from("expense_categories").select("*").eq("id", id).single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseCategory);
  },
  async getAll({ userId }: { userId: string }) {
    const { data, error } = await supabase.from("expense_categories").select("*").eq("user_id", userId).order("name", { ascending: true });

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseCategory[]);
  },
  async create(category: Omit<ExpenseCategory, "id">) {
    const { data, error } = await supabase.from("expense_categories").insert(category).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseCategory);
  },
  async update(id: string, category: Partial<Omit<ExpenseCategory, "id" | "userId">>) {
    const { data, error } = await supabase.from("expense_categories").update(category).eq("id", id).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as ExpenseCategory);
  },
  async delete(id: string) {
    const { error } = await supabase.from("expense_categories").delete().eq("id", id);

    if (error) {
      return Response.error(error);
    }

    return Response.success({ id });
  },
};

export default $ExpenseCategory;
