export async function load({ ctx }) {
    const Components = ctx.table("components");
  
    const result = await Components.query({ perPage: 100 });
  
    return {
      components: result.data,
    };
  }
  