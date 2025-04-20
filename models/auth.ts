import { supabase } from "@/lib/supabaseConfig";
import { getBalance } from "@/lib/drip";

const getToken = async (token: string) => {
  const { data, error } = await supabase
    .from("auth_tokens")
    .select("*")
    .eq("verification_token", token)
    .maybeSingle();

  if (error) {
    return {
      status: 500,
      message: "Internal server error",
    };
  }

  // If Token does not exist: Response With Invalid Token
  if (!data) {
    return {
      status: 404,
      message: "Invalid Token!",
    };
  }

  // Filter Expired or Used Tokens
  if (data.status === "expired" || data.status === "used") {
    // If Token Expired: Response With Token Expired
    // If Token Already Used: Response With Token Already Used
    return data.status == "expired"
      ? {
          status: 400,
          message: "Token Expired!",
        }
      : {
          status: 400,
          message: "Token Already Used!",
        };
  }

  // If Token is Valid
  return {
    status: 200,
    data,
  };
};

const updateToken = async (token: string) => {
  const { data, error } = await supabase
    .from("auth_tokens")
    .update({ status: "used" })
    .eq("verification_token", token)
    .maybeSingle();

  if (error) {
    return {
      status: 500,
      message: "Internal server error",
    };
  }

  return {
    status: 200,
    data,
  };
};

const auth = async (
  token: string,
  minecraft_username: string,
  minecraft_id: string
) => {
  const tokenData = await getToken(token);
  if (tokenData.status !== 200) {
    return tokenData;
  }
  console.log(tokenData);
  const updateTokens = await updateToken(token);
  if (updateTokens.status !== 200) {
    return updateTokens;
  }
  const newBalance = await getBalance(tokenData.data.discord_id);

  const { data, error } = await supabase
    .from("users")
    .update({
      minecraft_id: minecraft_id,
      minecraft_username: minecraft_username,
      is_verified: true,
      updated_at: new Date().toISOString(),
      balance: newBalance,
    })
    .eq("discord_id", tokenData.data.discord_id)
    .maybeSingle();

  if (error) {
    return {
      status: 500,
      message: "Internal server error",
    };
  }
  const userData = await supabase
    .from("users")
    .select("*")
    .eq("discord_id", tokenData.data.discord_id)
    .maybeSingle();

  if (userData.error) {
    return {
      status: 500,
      message: "Internal server error",
    };
  }
  return userData.data;
};
export { auth };
