import { PageList } from "./PageList.js";

export async function update_page({ctx, body}) {
  await ctx.table('pages').update(body.id, {
    title: body.title,
    slug: body.slug,
    layout_id: body.layout_id,
    head: body.head
  })

  return {
    body: {
      success: true
    }
  }
}

export async function add({ ctx, body }) {
  const page = {
    title: body.title,
    slug: body.slug,
    theme: body.theme,
    layout_id: body.layout_id,
    head: "",
    content: [],
    published: false,
  };
  await ctx.table("pages").insert(page);

  return {
    body: {
      success: true,
    },
  };
}

export async function load({ ctx }) {
  const pages =await ctx
  .table("pages")
  .query({ perPage: 100 })
  .then((res) => res.data)


  const layouts = await ctx.table('layouts').query({perPage: 100}).then(res => res.data)
  return {
    pages,
    layouts
  };
}

export default PageList;
