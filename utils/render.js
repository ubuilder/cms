import hbs from "handlebars";

export async function renderInstance(
  ctx,
  instance,
  rootId,
  { item = (x) => x.item.content, placeholder = (x) => "x" } = {}
) {
  const instanceProps = {};

  const props = {};
  instance.component.props.map((prop) => {
    props[prop.name] = (instanceProps[prop.name] ?? prop.default_value ?? "")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  async function renderComponent(component, instanceProps, instanceSlot) {
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
        console.log({ slotItem, instanceSlot });
        const slot = await renderInstance2(slotItem);
        slotItem.content = slot;

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
      const slot = await ctx.table("instances").get({
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
          await ctx.table("instances").get({ where: { id: slotId } })
        );
      }

      return renderComponent(slot.component, slot.props, slot.slot);
    }
  }

  async function renderInstance2(instance) {
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

    console.log("renderComponent", {component, props, slot})
    return renderComponent(component, props, slot);
  }

  instance.content = await renderInstance2(instance);

  return instance;
}

async function normalizeProps({ ctx, item } = {}) {
  for (let propName in item?.props ?? {}) {
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

export async function getInstance(ctx, id) {
  const instance = await ctx.table("instances").get({
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
  if (!page) return "page is not defined";

  try {
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
    `;

    // const layoutTemplate = page.layout?.template ?? `{{{head}}}{{{body}}}`;

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
