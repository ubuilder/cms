export async function insert_data({ ctx, params, body }) {

    const [id] = await ctx.table(params.table).insert(body.data);
  
    return {
      body: {
        success: true,
        id
      }
    }
  }
  export async function remove_data({ ctx, params, body }) {
    await ctx.table(params.table).remove(body.id);
  
    return {
      body: {
        success: true,
      }
    }
  }
  export async function update_data({ ctx, params, body }) {
    const result = await ctx.table(params.table).update(body.id, body.data)
  
    return {
      body: {
        success: true,
        result
      }
    }
  }