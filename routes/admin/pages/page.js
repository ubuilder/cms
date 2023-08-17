import { PageList } from "./PageList.js";

export * from './actions.js';

export async function load({ ctx }) {
  const pages =await ctx.table('pages').query({ perPage: 100 })
  .then((res) => res.data)

  return {
    pages,
  };
}

export default PageList;
