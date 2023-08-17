export async function load({ ctx, params, locals }) {
  const table = await ctx.Tables.query({
    perPage: 100,
    where: {
      slug: params.table
    }
  }).then((res) => res.data[0]);

  locals.table = table;
}
