import { supabase } from "@/lib/supabaseConfig";
import userModel from "@/models/users";

interface AuthToken {
  id: number;
  verification_token: string;
  discord_id: string;
  status: "used" | "expired" | "pending";
  [key: string]: any;
}

interface AuthData {
  token: string;
  username: string;
  xuid: string;
}

export default class AuthModel {
  static async getToken(data: { token: string }): Promise<AuthToken | null> {
    try {
      const { data: results, error } = await supabase
        .from("auth_tokens")
        .select("*")
        .eq("verification_token", data.token)
        .maybeSingle<AuthToken>();

      if (error) throw error;
      return results;
    } catch (error: any) {
      throw error;
    }
  }

  static async auth(data: AuthData): Promise<any> {
    try {
      const token = await this.getToken({ token: data.token });

      if (!token) return { status: 400, message: "Invalid token" };

      if (token.status === "expired" || token.status === "used") {
        return { status: 400, message: "Token already expired" };
      }
      const { data: updatedToken, error } = await supabase
        .from("auth_tokens")
        .update({ status: "used" })
        .eq("verification_token", token.verification_token)
        .select()
        .maybeSingle();

      if (error) throw error;

      return await userModel.updateUser({
        discord_id: token.discord_id,
        balance: 0,
        minecraft_username: data.username,
        minecraft_id: data.xuid,
        is_verified: true,
        updated_at: new Date().toISOString(),
      });
    } catch (error: any) {
      throw error;
    }
  }
}
