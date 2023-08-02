import { PageList } from "./PageList.js";

export async function add({ ctx, body }) {
  const page = {
    title: body.title,
    slug: body.slug,
    layout: body.layout,
    template: body.template,
    published: false,
    version: 1,
  };
  await ctx.table("page").insert(page);

  return {
    body: {
      success: true,
    },
  };
}

export async function load({ ctx }) {
  return {
    pages: await ctx
      .table("pages")
      .query({ perPage: 100 })
      .then((res) => res.data),
  };
}

export default PageList;
