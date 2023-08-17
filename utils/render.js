import hbs from "handlebars";
import { Instances, Components } from "../models.js";
import { InstanceWrapper } from "../routes/editor/[id]/Item.js";
import { SlotPlaceholder } from "../routes/editor/[id]/Placeholder.js";

async function evaluateProp(value) {
  console.log(value);
  if (typeof value !== "object") return value;

  if (value.type === "static") {
    return value.value;
    // const res = await ctx
    //   .table(value.table)
    //   .get({ where: value.where, select: { [value.field]: true } });

    // return res[value.field];
  } else {
    // dynamic...
    return "DYNAMIC";
    // return value.value;
  }
}

const EmptyInstanceWrapper = ({ instance, html, parent }) => html;
const EmptySlotPlaceholder = ({ instance, parent }) => "x";

// export async function renderInstance(
//   ctx,
//   instance,
//   rootId,
//   { item = (x) => x.item.content, placeholder = (x) => "" } = {}
// ) {
//   if(!instance) throw new Error('Instance not found: ')
//   const instanceProps = {};

//   const props = {};
//   instance.component.props.map((prop) => {
//     // check if array works
//     props[prop.name] = (instanceProps[prop.name] ?? JSON.stringify(prop.default_value) ?? "")
//   });

//   const slot = [];

//   for (let slotId of instance.slot_ids ?? []) {
//     const instance2 = await getInstance(ctx, slotId);

//     instance2.parent = instance;

//     const renderedInstance = await renderInstance(ctx, instance2, rootId, {item, placeholder});

//     slot.push(renderedInstance);

//     // slot.push(await renderInstance(await getInstance(ctx, slotId)))
//   }

//   if (slot.length === 0) {
//     slot.push(
//       placeholder({ parent_id: instance.id, placement: "slot" }).toString()
//     );
//   }
//   instance.slot = slot;
//   // instance.props = {}

//   async function renderComponent(component, instanceProps, instanceSlot, {item}) {
//     if (component.id === "000") {
//       async function evaluateProp({ ctx, value }) {
//         if (typeof value !== "object") return value;

//         if (value.type === "load") {
//           const res = await ctx
//             .table(value.table)
//             .get({ where: value.where, select: { [value.field]: true } });

//           return res[value.field];
//         } else if (value.type === "static") {
//           return value.value;
//         }
//         return "todo.. (evaluateProp)";
//       }

//       const props = {};

//       let slots = [];
//       for (let slotItem of instanceSlot) {
//         if (typeof slotItem === "string") {
//           slots.push(slotItem);
//           continue;
//         }

//         const slot = await renderInstance2(slotItem, {item: slotItem.component_id === '000' ? item : (x) => x.item.content});
//         slotItem.content = slot;
//         slotItem.component = slotItem.component ?? await Components.get({where: {id: slotItem.component_id}})
//         slotItem.parent = instance

//         slots.push(item({ item: slotItem, rootId }));

//       }

//       props.slot = slots.join("");

//       for (let prop of component.props) {
//         props[prop.name] = await evaluateProp({
//           ctx,
//           value: instanceProps[prop.name] ?? prop.default_value ?? "",
//         });
//       }

//       return hbs.compile(props.template ?? "{{{slot}}}")(props);
//     } else {
//       const slot = await Instances.get({
//         where: { id: component.slot_id },
//         with: {
//           component: {
//             table: "components",
//             field: "component_id",
//           },
//         },
//       });

//       slot.slot = [];
//       for (let slotId of slot.slot_ids) {
//         slot.slot.push(
//           await Instances.get({ where: { id: slotId } })
//         );
//       }

//       return renderComponent(slot.component, slot.props, slot.slot, {item});
//     }
//   }

//   async function renderInstance2(instance, {item}) {
//     if (typeof instance == "string") return instance;

//     if (!instance) throw new Error("instance is not defined here");

//     const component =
//       instance.component ??
//       (await ctx
//         .table("components")
//         .get({ where: { id: instance.component_id } }));
//     const props = instance.props;
//     let slot = instance.slot ?? [];

//     if (slot.length === 0) {
//       for (let slotId of instance.slot_ids ?? []) {
//         const inst = await ctx
//           .table("instances")
//           .get({ where: { id: slotId } });
//         if (!inst) throw new Error("instance is not defined: " + slotId);
//         slot.push(inst);
//       }
//     }

//     return renderComponent(component, props, slot, {item});
//   }

//   instance.content = await renderInstance2(instance, {item});

//   return instance;
// }

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
export async function renderInstance({
  instance,
  parent = undefined,
  instanceWrapper = EmptyInstanceWrapper,
  slotPlaceholder = EmptySlotPlaceholder,
}) {
  if (!instance) throw new Error("Instance not found...");

  instance.parent = parent;

  if (!instance.component) {
    instance.component = await Components.get({
      where: { id: instance.component_id },
    });
  }

  if (!instance.slots) {
    instance.slots = [];

    for (let slot_id of instance.slot_ids) {
      const slot = await Instances.get({
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
    if(isInsideComponent){
      instanceWrapper = EmptyInstanceWrapper
      slotPlaceholder = EmptySlotPlaceholder
    }
    console.log("render component", component.id);
    if (component.id === "000") {
      let slots = [];
      console.log(slot);
      for (let slotItem of slot) {
        const res = await renderInstance({
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
        instance.component = await Components.get({
          where: { id: instance.component_id },
          with: {
            slot: {
              table: "instances",
              field: "slot_id",
            },
          },
        });
        instance.component.slot ??= {};
        instance.component.slot.component = await Components.get({
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
          const slot = await Instances.get({ where: { id: slot_id } });

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
function renderHead(page) {
  const ctx = { page: { title: page.title, slug: page.slug } };

  return hbs.compile(page.head)(ctx);
}

/**
 * @param {Page} page
 *
 * @returns {string}
 */
async function renderBody(page) {
  if (!page.slot) {
    page.slot = await Instances.get({ where: { id: page.slot_id } });
  }

  const body = await renderInstance({
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
export async function renderPage({ page }) {
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

    const head = renderHead(page);
    const body = await renderBody(page);

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
