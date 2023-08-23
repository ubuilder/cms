import { PageList } from "./PageList.js";

export * from './actions.js';

export async function load({ ctx, query }) {
  const pages =await ctx.table('pages').query({ perPage: 100, where: query.filters })
  .then((res) => res.data)

  return {
    pages,
  };
}

export default PageList;
