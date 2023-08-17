import { Pages } from "../../../models.js";
import { renderInstance, renderPage } from "../../../utils/render.js";

export async function load({ ctx, params, query }) {

  console.log('preview', params.id)
  let page = await Pages.get({where: {id: params.id}});

  if (!page) return {};
  const result = await renderPage({ctx, page})
  
  // console.log(result)

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
