import { supabase } from "@/lib/supabaseConfig";

export default async (minecraft_id: string) => {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("minecraft_id", minecraft_id)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return {
    status: 200,
    message: "User logged out successfully0",
  };
};
