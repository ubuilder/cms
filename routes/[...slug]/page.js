import { renderPage } from "../../utils/render.js";

export async function load({ ctx, params, query }) {
  const slug = params['*'];

  let page = await ctx.table('pages').get({
    where: { slug },
    with: {
      layout: {
        table: "layouts",
        field: "layout_id",
      },
    },
  });

  if (!page) return {};

  return {
    content: await renderPage(ctx, {page})
  }

}

export default ({ content }) => {

  if (!content) {
    return;
  }

  return content;

};
