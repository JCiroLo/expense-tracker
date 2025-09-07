import Response from "@/lib/response";
import supabase from "@/lib/supabase";

const $User = {
  create: async (user: { id: string; email: string }) => {
    const { data, error } = await supabase.from("users").insert(user).select().single();

    if (error) {
      return Response.error(error);
    }

    return Response.success(data);
  },
};

export default $User;
