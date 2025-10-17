import Response from "@/lib/response";
import supabase from "@/lib/supabase";
import type { User } from "@/types/global";

const $User = {
  get: async (id: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data as User);
  },
  create: async (user: Omit<User, "created_at">) => {
    const { data, error } = await supabase.from("users").insert(user).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data);
  },
};

export default $User;
