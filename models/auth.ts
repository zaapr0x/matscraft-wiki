import { supabase } from "@/lib/supabaseConfig";
import userModel from "@/models/users";
import { getBalance } from "@/lib/drip";
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

  static async auth(
    data: AuthData
  ): Promise<{ status: number; message?: string; data?: any }> {
    try {
      const token = await this.getToken({ token: data.token });

      if (!token) {
        return { status: 400, message: "Invalid token" };
      }

      if (token.status === "expired") {
        return { status: 400, message: "Token already expired" };
      }
      if (token.status === "used") {
        return { status: 400, message: "Token already used" };
      }

      const { data: updatedToken, error } = await supabase
        .from("auth_tokens")
        .update({ status: "used" })
        .eq("verification_token", token.verification_token)
        .select()
        .maybeSingle();

      if (error || !updatedToken) {
        console.error("Failed to update token status:", error);
        return { status: 500, message: "Failed to update token status" };
      }

      const balance = await getBalance(token.discord_id);

      const updateUser = await userModel.updateUser({
        discord_id: token.discord_id,
        balance: balance.tokens,
        minecraft_username: data.username,
        minecraft_id: data.xuid,
        is_verified: true,
        updated_at: new Date().toISOString(),
      });

      if (!updateUser) {
        return { status: 500, message: "Failed to update user" };
      }

      const user = await userModel.getUser(token.discord_id);

      return {
        status: 200,
        data: user,
      };
    } catch (error: any) {
      console.error("Auth error:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }
}
