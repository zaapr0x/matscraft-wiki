import { supabase } from "@/lib/supabaseConfig";
import { getBalance, updateBalance } from "@/lib/drip";
interface User {
  discord_id: string;
  minecraft_id: string;
  balance: number;
  is_verified?: boolean;
  minecraft_username?: string;
  updated_at?: string;
  [key: string]: any;
}

export default class Users {
  static async getBalance(minecraft_id: string): Promise<number> {
    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("minecraft_id", minecraft_id)
      .maybeSingle<{ balance: number }>();

    if (error) throw new Error(error.message);
    return data?.balance ?? 0;
  }

  static async updateBalance(
    minecraft_id: string,
    amount: number
  ): Promise<any> {
    const currentBalance = await this.getBalance(minecraft_id);
    let newBalance = currentBalance + amount;

    if (newBalance < 0) newBalance = 0;
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("minecraft_id", minecraft_id)
        .select("balance")
        .maybeSingle<{ balance: number }>();
      return { status: 200, balance: data?.balance ?? 0 };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }
  static async syncBalance(
    minecraft_id: string,
    discord_id: string,
    amount: number
  ): Promise<any> {
    const currentBalance = await updateBalance(discord_id, amount);
    let newBalance = await supabase
      .from("users")
      .update({ balance: currentBalance.tokens })
      .eq("discord_id", discord_id)
      .maybeSingle();
    if (newBalance.error) throw new Error(newBalance.error.message);

    return { status: 200, balance: currentBalance.tokens };
  }
  catch(error: any) {
    return { status: 500, message: error.message };
  }

  static async getUser(discordId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("discord_id", discordId)
        .maybeSingle<User>();

      if (error) throw new Error(error.message);
      return data ?? null;
    } catch (error: any) {
      throw error;
    }
  }

  static async updateUser(data: Partial<User>): Promise<User> {
    try {
      const { data: results, error } = await supabase
        .from("users")
        .update(data)
        .eq("discord_id", data.discord_id!)
        .select("*")
        .maybeSingle<User>();

      if (error) throw new Error(error.message);
      return results!;
    } catch (error: any) {
      throw error;
    }
  }
  static async removeUser(minecraft_id: string): Promise<void> {
    try {
      const status = await supabase
        .from("users")
        .delete()
        .eq("minecraft_id", minecraft_id);

      if (status.error) throw new Error(status.error.message);
      return;
    } catch (error: any) {
      throw error;
    }
  }
}
