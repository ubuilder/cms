import hbs from "handlebars";

async function normalizeProps({ ctx, item } = {}) {
  for (let propName in item.props) {
    const prop = item.props[propName];
    if (prop.type === "load") {
      const res = await ctx
        .table(prop.table)
        .get({ where: prop.where, select: { [prop.field]: true } });
      item.props[propName] = res[prop.field];
      // loads[] =
    } else if (prop.type === "static") {
      item.props[propName] = prop.value;
    }
  }
  if (item.slot) {
    for (let item2 of item.slot) {
      await normalizeProps({ ctx, item: item2 });
    }
  }
}

function renderHead({ page }) {
  const ctx = { page: { title: page.title, slug: page.slug } };

  return hbs.compile(page.head)(ctx);
}

function renderItem({ item, components }) {
  const id = item.component_id;
  const props = {};
  const component = components.find((x) => x.id === id);

  if (item.slot) {
    const slot = renderBody({ content: item.slot, components });
    props["slot"] = slot;
  }

  console.log({components, id})
  const template = component.template;

  component.props.map((prop) => {
    props[prop.name] = item.props[prop.name] ?? prop.default_value;
  });

  const result = hbs.compile(template)(props);
  return result;
}

function renderBody({ content, components }) {
  let result = "";

  for (let item of content) {
    // handle styles..
    result += renderItem({ item, components });
  }
  return result;
}

export async function renderPage({ ctx, page }) {
    if(!page) return 'page is not defined';
  for (let item of page.content) {
    await normalizeProps({ item, ctx });
  }
  try {
    let components = await ctx
      .table("components")
      .query({ perPage: 100 })
      .then((res) => res.data);

    const layout = `
    <!DOCTYPE html>
<html>
  <head>
  <title>{{page.title}}</title>

    {{{head}}}
  </head>
<body>
  {{{body}}}
</body>
</html>
    `

    // const layoutTemplate = page.layout?.template ?? `{{{head}}}{{{body}}}`;

    const template = hbs.compile(layout);

    const head = renderHead({ page });
    const body = renderBody({ content: page.content, components });

    console.log(template)
    const result = template({
      body,
      head,
    });
    return result;
  } catch (err) {
    console.log(err)
    return `there is an error in template of this page, \n\n${err.message}.\n\n <a href="/admin/page/${page.slug}">Edit Page</a>"`;
  }
}