export async function load({ ctx, params, locals }) {
  console.log("locals: ", locals);
  const table = await ctx.Tables.query({
    perPage: 100,
    with: { fields: { table: "fields", field: "table_id", multiple: true } },
  }).then((res) => res.data[0]);

  locals.table = table;
}
