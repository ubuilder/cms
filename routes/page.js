import { View } from "@ulibs/ui"
import { renderPage } from "../utils/render.js";
import { Sites } from "../utils/models.js";

export async function load({ ctx, headers }) {

    const sites = await Sites.query();

    let theSite
    for(let site of sites.data) {
        if(site.domains.includes(headers.host)) {
            theSite = site;
            break;
        }
    }

  let page = await ctx.table('pages').get({where: {id: theSite.default_page_id}});

  if (!page) return {};
  const result = await renderPage(ctx, {page})

  return {
    content: result
  }
}

export default ({ content }) => {
  if (!content) {
    return View('MAIN PAGE');
  }

  return content;
};
