import hbs from "handlebars";
import { Instances, Components } from "../models.js";

export async function renderInstance(
  ctx,
  instance,
  rootId,
  { item = (x) => x.item.content, placeholder = (x) => "x" } = {}
) {
  if(!instance) throw new Error('Instance not found: ')
  const instanceProps = {};

  const props = {};
  instance.component.props.map((prop) => {
    // check if array works
    props[prop.name] = (instanceProps[prop.name] ?? JSON.stringify(prop.default_value) ?? "")
  });

  const slot = [];

  for (let slotId of instance.slot_ids ?? []) {
    const instance2 = await getInstance(ctx, slotId);

    instance2.parent = instance;

    const renderedInstance = await renderInstance(ctx, instance2, rootId, {item, placeholder});

    slot.push(renderedInstance);

    // slot.push(await renderInstance(await getInstance(ctx, slotId)))
  }

  if (slot.length === 0) {
    slot.push(
      placeholder({ parent_id: instance.id, placement: "slot" }).toString()
    );
  }
  instance.slot = slot;
  // instance.props = {}

  async function renderComponent(component, instanceProps, instanceSlot, {item}) {
    if (component.id === "000") {
      async function evaluateProp({ ctx, value }) {
        if (typeof value !== "object") return value;

        if (value.type === "load") {
          const res = await ctx
            .table(value.table)
            .get({ where: value.where, select: { [value.field]: true } });

          return res[value.field];
        } else if (value.type === "static") {
          return value.value;
        }
        return "todo.. (evaluateProp)";
      }

      const props = {};

      let slots = [];
      for (let slotItem of instanceSlot) {
        if (typeof slotItem === "string") {
          slots.push(slotItem);
          continue;
        }

        const slot = await renderInstance2(slotItem, {item: slotItem.component_id === '000' ? item : (x) => x.item.content});
        slotItem.content = slot;
        slotItem.component = slotItem.component ?? await Components.get({where: {id: slotItem.component_id}})
        slotItem.parent = instance
        
        slots.push(item({ item: slotItem, rootId }));

      }

      props.slot = slots.join("");

      for (let prop of component.props) {
        props[prop.name] = await evaluateProp({
          ctx,
          value: instanceProps[prop.name] ?? prop.default_value ?? "",
        });
      }

      return hbs.compile(props.template ?? "{{{slot}}}")(props);
    } else {
      const slot = await Instances.get({
        where: { id: component.slot_id },
        with: {
          component: {
            table: "components",
            field: "component_id",
          },
        },
      });

      slot.slot = [];
      for (let slotId of slot.slot_ids) {
        slot.slot.push(
          await Instances.get({ where: { id: slotId } })
        );
      }

      return renderComponent(slot.component, slot.props, slot.slot, {item});
    }
  }

  async function renderInstance2(instance, {item}) {
    if (typeof instance == "string") return instance;

    if (!instance) throw new Error("instance is not defined here");

    const component =
      instance.component ??
      (await ctx
        .table("components")
        .get({ where: { id: instance.component_id } }));
    const props = instance.props;
    let slot = instance.slot ?? [];

    if (slot.length === 0) {
      for (let slotId of instance.slot_ids ?? []) {
        const inst = await ctx
          .table("instances")
          .get({ where: { id: slotId } });
        if (!inst) throw new Error("instance is not defined: " + slotId);
        slot.push(inst);
      }
    }

    return renderComponent(component, props, slot, {item});
  }

  instance.content = await renderInstance2(instance, {item});

  return instance;
}

function renderHead({ page }) {
  const ctx = { page: { title: page.title, slug: page.slug } };

  return hbs.compile(page.head)(ctx);
}

export async function getInstance(ctx, id) {
  const instance = await Instances.get({
    where: { id },
    with: {
      component: {
        table: "components",
        field: "component_id",
      },
    },
  });
  if (!instance) throw new Error("instance not found: " + id);

  instance.slot = []

  for(let slotId of instance.slot_ids) {
    const slotItem = await getInstance(ctx, slotId);
    instance.slot.push(slotItem)
  }

  return instance;
}

export async function renderPage({ ctx, page }) {
  if (!page) throw new Error('Page not found');

  try {
    const layout = `<!DOCTYPE html>
<html lang="en">
  <head>
    {{{head}}}
  </head>
  <body>
    {{{body}}}
  </body>
</html>`;

    const template = hbs.compile(layout);

    const head = renderHead({ page });
    const instance = await getInstance(ctx, page.slot_id);
    const renderedInstance = await renderInstance(ctx, instance, page.slot_id);
    const body = renderedInstance.content;

    const result = template({
      body,
      head,
    });

    return result;
  } catch (err) {
    console.log(err);
    return `there is an error in template of this page, \n\n${err.message}.\n\n <a href="/admin/page/${page.slug}">Edit Page</a>"`;
  }
}
