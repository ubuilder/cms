import { renderPage } from "../../../utils/render.js";

export async function load({ ctx, params, query }) {

  let page = await ctx.table('pages').get({where: {id: params.id}});

  if (!page) return {};
  const result = await renderPage(ctx, {page})

  return {
    content: result
  }
}

export default ({ content }) => {
  if (!content) {
    return;
  }

  return content;
};
