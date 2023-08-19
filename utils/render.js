import hbs from "handlebars";

async function evaluateProp(value) {
  if (typeof value !== "object") return value;

  if (value.type === "static") {
    return value.value;
  } else {
    // const res = await ctx
    //   .table(value.table)
    //   .get({ where: value.where, select: { [value.field]: true } });

    // return res[value.field];
    // dynamic...
    return "DYNAMIC";
    // return value.value;
  }
}

const EmptyInstanceWrapper = ({ instance, html, parent }) => html;
const EmptySlotPlaceholder = ({ instance, parent }) => "x";

/**
 *
 * @param {Object} param0
 * @param {Instance} param0.instance
 * @param {Instance | undefined} param0.parent
 * @param {any} param0.instanceWrapper
 * @param {any} param0.slotPlaceholder
 *
 * @returns {Promise<string>}
 */
export async function renderInstance(ctx, {
  instance,
  parent = undefined,
  instanceWrapper = EmptyInstanceWrapper,
  slotPlaceholder = EmptySlotPlaceholder,
}) {
  if (!instance) throw new Error("Instance not found...");

  instance.parent = parent;

  if (!instance.component) {
    instance.component = await ctx.table('components').get({
      where: { id: instance.component_id },
    });
  }

  if (!instance.slots) {
    instance.slots = [];

    for (let slot_id of instance.slot_ids) {
      const slot = await ctx.table('instances').get({
        where: { id: slot_id },
        with: {
          component: {
            table: "components",
            field: "component_id",
          },
        },
      });
      instance.slots.push(slot);
    }
  }

  async function renderComponent({ component, props, slot }, isInsideComponent = false) {
  
    if(!component) throw new Error("Component not found")

    if(isInsideComponent){
      instanceWrapper = EmptyInstanceWrapper
      slotPlaceholder = EmptySlotPlaceholder
    }
    if (component.id === "000") {
      let slots = [];
 
      for (let slotItem of slot) {
        console.log(slot)
        if(!slotItem) throw new Error('Instance doesn\'t exists...')
        
        
        const res = await renderInstance(ctx, {
          instance: slotItem,
          parent: instance,
          instanceWrapper,
          slotPlaceholder,
        });

        slots.push(
          instanceWrapper({
            html: res,
            instance: slotItem,
            parent: instance,
          }).toString()
        );
      }

      const _props = {};

      _props.slot = slots.join("") || slotPlaceholder({ instance, parent });

      for (let prop of component.props) {
        _props[prop.name] = await evaluateProp(
          props[prop.name] ?? prop.default_value
        );
      }

      return hbs.compile(_props.template)(_props);
    } else {
      if (!instance.component?.slot?.component) {
        instance.component = await ctx.table('components').get({
          where: { id: instance.component_id },
          with: {
            slot: {
              table: "instances",
              field: "slot_id",
            },
          },
        });
        instance.component.slot ??= {};
        instance.component.slot.component = await ctx.table('components').get({
          where: { id: instance.component.slot?.component_id },
          with: {
            slot: {
              table: "instances",
              field: "slot_id",
            },
          },
        });
        instance.component.slot.slots = [];
        if(!instance.component.slot.slot_ids) throw new Error("Instance has no slot " + instance.id)

        for (let slot_id of instance.component.slot.slot_ids ?? []) {
          const slot = await ctx.table('instances').get({ where: { id: slot_id } });

          instance.component.slot.slots.push(slot);
        }
      }

      // const x = await renderInstance(instance.component.slot);
      return renderComponent({
        component: instance.component.slot.component,
        props: instance.component.slot.props,
        slot: instance.component.slot.slots,
      }, true);
    }
  }

  return instanceWrapper({
    html: await renderComponent({
      component: instance.component,
      props: instance.props,
      slot: instance.slots,
    }),
    instance,
    parent,
  });
}

/**
 *
 * @param {Page} page
 * @returns string
 */
function renderHead(ctx, page) {
  const props = { page: { title: page.title, slug: page.slug } };

  return hbs.compile(page.head)(props);
}

/**
 * @param {Page} page
 *
 * @returns {Promise<string>}
 */
async function renderBody(ctx, page) {
  if (!page.slot) {
    page.slot = await ctx.table('instances').get({ where: { id: page.slot_id } });
  }

  console.log('renderInstance', page.slot)
  const body = await renderInstance(ctx, {
    instance: page.slot,
    instanceWrapper: EmptyInstanceWrapper,
    slotPlaceholder: EmptySlotPlaceholder,
  });

  return body.toString();
}

/**
 *
 * @param {Object} param0
 * @param {Page | undefined} param0.page
 * @returns
 */
export async function renderPage(ctx, { page }) {
  if (!page) throw new Error("Page not found");

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

    const head = renderHead(ctx, page);
    const body = await renderBody(ctx, page);

    const result = template({
      body,
      head,
    });

    return result;
  } catch (err) {
    // console.log(err);
    return `there is an error in template of this page, \n\n${err.message}.\n\n <a href="/admin/page/${page.slug}">Edit Page</a>"`;
  }
}
