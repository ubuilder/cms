export async function load({ ctx, params, locals }) {
  const table = await ctx.Tables.get({where: {
      slug: params.table
    }
  })
  
  locals.table = table;
}
