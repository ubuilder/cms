import hbs from 'handlebars'

export async function load({ ctx, params, query }) {
  const pageId = params.id;

  let page = await ctx.table("pages").get({ where: { id: pageId } });

  return {
    page,
  };
}

export default ({ page }) => {
  if (!page) {
    return;
  }

  try {
    const template = hbs.compile(page.template);

    return `<!DOCTYPE html><html><head>${page.head}</head><body>${template(
      {}
    )}</body></html>`;
  } catch (err) {
    return `there is an error in template of this page, \n\n${err.message}.\n\n <a href="/admin/page/${page.slug}">Edit Page</a>"`;
  }
};
