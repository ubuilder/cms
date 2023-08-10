import hbs from "handlebars";
import { Placeholder } from "./Placeholder.js";
import { Item } from "./Item.js";

export default async function load({ ctx, params }) {
    const id = params.id;
  
    const page = await ctx.table("pages").get({ where: { id } });
  
    const components = await ctx.table("components").query({ perPage: 100 });
  
    async function renderItem(item) {
      const component = await ctx
        .table("components")
        .get({ where: { id: item.component_id } });
  
      item.component = component;
      const itemProps = {};
  
      for (let propName in item.props) {
        const prop = item.props[propName];
  
        if (prop.type === "load") {
          const res = await ctx
            .table(prop.table)
            .get({ where: prop.where, select: { [prop.field]: true } });
  
          itemProps[propName] = res[prop.field];
        } else if (prop.type === "static") {
          itemProps[propName] = prop.value;
        }
      }
  
      const props = {};
  
      if(!template) return;
      const template = component.template;
      const hasSlot = template.indexOf("{{slot}}" > -1);
  
      component.props.map((prop) => {
        props[prop.name] = itemProps[prop.name] ?? prop.default_value;
      });
  
      if (hasSlot) {
        if (item.slot?.length > 0) {
          props.slot = (
            await Promise.all(
              item.slot.map(async (x) => {
                x.parent = item;
  
                return Item({
                  item: {
                    ...(await renderItem(x)),
                    parent: item,
                  },
                });
              })
            )
          ).join("");
          //  Placeholder({ id: item.id, placement: "slot" })]
        } else {
          props.slot = [
            Placeholder({ name: component.name, id: item.id, placement: "slot" }),
          ];
        }
      }
  
      // render hbs
      item.content = hbs.compile(template)(props);
  
      return item;
    }
  
    for (let item of page.content) {
      item = await renderItem(item);
    }
  
    return {
      page,
      components: components.data,
    };
  }
  