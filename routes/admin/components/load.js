
export async function load({ ctx }) {
  
    const result = await ctx.table('components').query({ perPage: 100 });
  
    return {
      components: result.data,
    };
  }
  