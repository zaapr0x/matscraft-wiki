import axios from "axios";

const API_BASE_URL = "https://api.drip.re/api/v4";

interface BalanceData {
  balances: {
    [pointId: string]: string; // e.g. "tokens": "100"
  };
  [key: string]: unknown; // other optional data from API
}

interface UpdateBalancePayload {
  realmPointId: string;
  tokens: number;
}

interface UpdateBalanceResponse {
  message?: string;
  success?: boolean;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBalance = async (userId: string): Promise<BalanceData> => {
  try {
    const response = await axios.get<BalanceData>(
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateBalance = async (
  userId: string,
  amount: number
): Promise<UpdateBalanceResponse> => {
  try {
    const payload: UpdateBalancePayload = {
      realmPointId: process.env.REALM_POINT_ID || "",
      tokens: amount,
    };

    const response = await axios.patch<UpdateBalanceResponse>(
      `${API_BASE_URL}/realms/${process.env.REALM}/members/${userId}/tokenBalance`,
      payload,
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
