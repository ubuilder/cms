import { View } from "@ulibs/ui";
import hbs from "handlebars";

export async function load({ ctx, params, query }) {
  const pageId = params.id;

  let page = await ctx.table("pages").get({
    where: { id: pageId },
    with: {
      layout: {
        table: "layouts",
        field: "layout_id",
      },
    },
  });

  if(!page) return {}

  console.log(page)


  for(let item of page.content) {
    for(let propName in item.props) {
      const prop = item.props[propName]
      if(prop.type === 'load') {
        const res = await ctx.table(prop.table).get({where: prop.where, select: {[prop.field]: true}})
        item.props[propName] = res[prop.field]
        // loads[] = 
      } else if(prop.type === 'static') {
        item.props[propName] = prop.value
      }
    }
  }
  

  // only used components
  let components = await ctx.table('components').query({perPage: 100}).then(res => res.data)

  return {
    page,
    components
  };
}

export default ({ page, components }) => {
  if (!page) {
    return;
  }

  try {
    const layoutTemplate = page.layout?.template ?? `{{{head}}}{{{body}}}`;

    console.log(page, layoutTemplate)

    

    const template = hbs.compile(layoutTemplate);

    function renderHead() {
      const ctx = { page: { title: page.title, slug: page.slug } };
      
      return hbs.compile(page.head)(ctx);
    }

    function renderItem(item) {
      const id = item.component_id;
      const props = {}
      const component = components.find(x => x.id === id)

      const template = component.template
      
      component.props.map(prop => {
        props[prop.name] = item.props[prop.name] ?? prop.default_value;
      })


      return hbs.compile(template)(props)
    }

    function renderBody() {
      let result = ""

      for(let item of page.content) {
        result += renderItem(item)
      }

      return result
    }
    
    const head = renderHead();
    const body = renderBody();

    const result = template({
      body,
      head,
    });
    return result;
  } catch (err) {
    return `there is an error in template of this page, \n\n${err.message}.\n\n <a href="/admin/page/${page.slug}">Edit Page</a>"`;
  }
};
