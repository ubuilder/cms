import hbs from 'handlebars'

// render published pages

export async function load({ctx, params}) {

    const slug = params['*']


  let page = await ctx.table("pages").get({ where: { slug, published: true } });


  return {
    page
  }
}

export default ({ page }) => {
  if (!page) {
    return;
  }

  try {
    const template = hbs.compile(page.template);

    return `<!DOCTYPE html><html><head>${page.head}</head><body>${template({})}</body></html>`;
  } catch (err) {
    return `there is an error in template of this page, \n\n${err.message}.\n\n <a href="/admin/page/${page.slug}">Edit Page</a>"`;
  }
};
