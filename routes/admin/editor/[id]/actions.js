import { uuid } from "uuidv4";
import { getInstance } from "./helpers.js";

// export async function update_title({ ctx, params, body }) {
//   const title = body.title;
//   const page = await getInstance(ctx, params.id);

//   await ctx.table("pages").update(page.id, { title });

//   return {
//     body: {
//       success: true,
//     },
//   };
// }

export async function create_component({ ctx, body, params }) {
  const { id, parent_id = params.id, name } = body;

  const newComponent = {
    name,
    slot_id: id,
    props: [],
  };

  const [component_id] = await ctx.table("components").insert(newComponent);

  // create instance of new component and replace in page
  const [instanceId] = await ctx.table("instances").insert({
    component_id,
    props: {},
    slot_ids: [],
  });

  const parentInstance = await ctx.table("instances").get(parent_id);

  parentInstance.slot_ids = parentInstance.slot_ids.map((x) => {
    if (x === id) return instanceId;
    return x;
  });

  await ctx.table("instances").update(parentInstance.id, parentInstance);

  return {
    body: {
      success: true,
    },
  };
}

export async function add_instance({ ctx, body, params }) {
  const parentId = body.parent_id || params.id;

  if (body.instance_id) {
    // console.log("TODO: get props from instance");
  }

  const newInstance = {
    id: uuid(),
    component_id: body.component_id,
    slot_ids: [],
    props: (body.props ?? []).reduce((prev, curr) => {
      return {
        ...prev,
        [curr.name]: curr.value,
      };
    }, {}),
  };

  const [instanceId] = await ctx.table("instances").insert(newInstance);

  const parentInstance = await ctx
    .table("instances")
    .get({ where: { id: parentId } });

  if (!body.position) {
    parentInstance.slot_ids.push(instanceId);
  } else {
    let slotIds = [];

    for (let slotId of parentInstance.slot_ids) {
      if (slotId === body.position) {
        if (body.placement === "before") {
          slotIds.push(instanceId);
          slotIds.push(slotId);
        } else if (body.placement === "after") {
          slotIds.push(slotId);
          slotIds.push(instanceId);
        } else {
          // inside
        }
      } else {
        slotIds.push(slotId);
      }
    }
    parentInstance.slot_ids = slotIds;
  }

  await ctx.table("instances").update(parentId, {
    slot_ids: parentInstance.slot_ids,
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function update_instance({ ctx, body, params }) {
  const props = body.props;

  const instanceId = body.id;

  await ctx.table("instances").update(instanceId, {
    props: props.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.name]: curr.value,
      };
    }, {}),
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function remove_instance({ ctx, params, body }) {
  const instanceId = body.id;
  const parentId = body.parent_id;

  // const page = await getInstance(ctx, pageId);
  const parentInstance = await ctx
    .table("instances")
    .get({ where: { id: parentId || params.id } });
  parentInstance.slot_ids = parentInstance.slot_ids.filter(
    (id) => id !== instanceId
  );

  if (instanceId === params.id) {
    return {
      body: {
        success: false,
      },
    };
  }
  await ctx.table("instances").remove(instanceId);

  await ctx.table("instances").update(parentInstance.id, parentInstance);

  return {
    body: {
      success: true,
    },
  };
}
