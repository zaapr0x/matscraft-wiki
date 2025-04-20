import axios from "axios";

const API_BASE_URL = "https://api.drip.re/api/v4";

// Define interfaces for the response data
interface MemberData {
  id: string;
  username: string;
  tokenBalance: TokenBalance[];
}

interface TokenBalance {
  realmPointId: string;
  tokens: number;
}

interface UpdateBalanceResponse {
  success: boolean;
  tokenBalance: TokenBalance;
}

const getBalance = async (userId: string): Promise<MemberData> => {
  try {
    const response = await axios.get<MemberData>(
      `${API_BASE_URL}/realms/${process.env.REALM}/members/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DRIP_API}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw error;
  }
};

const updateBalance = async (
  userId: string,
  amount: number
): Promise<UpdateBalanceResponse> => {
  try {
    const response = await axios.patch<UpdateBalanceResponse>(
      `${API_BASE_URL}/realms/${process.env.REALM}/members/${userId}/tokenBalance`,
      {
        realmPointId: process.env.REALM_POINT_ID,
        tokens: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DRIP_API}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update balance:", error);
    throw error;
  }
};

export { getBalance, updateBalance };
