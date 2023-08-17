import { Components } from "../../../models.js";

export async function load({ ctx }) {
  
    const result = await Components.query({ perPage: 100 });
  
    return {
      components: result.data,
    };
  }
  