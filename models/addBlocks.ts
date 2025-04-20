import { supabase } from "@/lib/supabaseConfig";
import crypto from "crypto";

interface BlockRecord {
  hash: string;
  [key: string]: any;
}

interface InsertBlockResponse {
  status: number;
  message: string;
  data?: BlockRecord[];
}

export default class Matscraft {
  static async insertBlock(data: any | any[]): Promise<InsertBlockResponse> {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {
        status: 400,
        message: "Data is required and cannot be empty",
      };
    }

    try {
      const records = (Array.isArray(data) ? data : [data]).map((record) => ({
        ...record,
        hash: crypto
          .createHash("sha256")
          .update(JSON.stringify(record))
          .digest("hex"),
      }));

      const { data: results, error } = await supabase
        .from("minecraft_blocks")
        .insert(records)
        .select("*");

      if (error) {
        return {
          status: 500,
          message: error.message,
        };
      }

      return {
        status: 200,
        message: `Inserted ${results?.length ?? 0} record(s) successfully`,
        data: results ?? [],
      };
    } catch (error) {
      return {
        status: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
