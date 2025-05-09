import axios from "axios";

const API_BASE_URL = "https://api.drip.re/api/v4";

const getBalance = async (userId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/realms/${process.env.REALM}/members/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DRIP_API}`,
        },
      }
    );

    return response.data.tokens;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw error;
  }
};

const updateBalance = async (userId: string, amount: number) => {
  try {
    const response = await axios.patch(
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
