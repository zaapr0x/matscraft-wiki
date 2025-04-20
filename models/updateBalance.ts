import { supabase } from "@/lib/supabaseConfig";
import { updateBalance } from "@/lib/drip";

async function updateDripBalance(discord_id: string, amount: number) {
  const updatedBalance = await updateBalance(discord_id, amount);
  return updatedBalance.tokens;
}
export default async (discord_id: string, amount: number) => {
  const dripBalance = await updateDripBalance(discord_id, amount);
  const { data, error } = await supabase
    .from("users")
    .update({ balance: dripBalance })
    .eq("discord_id", discord_id)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return {
    status: 200,
    balance: dripBalance,
  };
};
