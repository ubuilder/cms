import { id } from "@ulibs/db";
import { cloneInstance } from "../../utils/instance.js";

export async function create_component({ ctx, body, params }) {
  const { instance_id, parent_id = params.id, name } = body;

  const newComponent = {
    name,
    slot_id: instance_id,
    props: [],
  };

  const [component_id] = await ctx.table("components").insert(newComponent);

  // create instance of new component and replace in page
  const [instanceId] = await ctx.table("instances").insert({
    component_id,
    props: {},
    slot_ids: [],
  });

  const parentInstance = await ctx
    .table("instances")
    .get({ where: { id: parent_id } });

  parentInstance.slot_ids = parentInstance.slot_ids.map((x) => {
    if (x === instance_id) return instanceId;
    return x;
  });

  await ctx.table("instances").update(parentInstance.id, parentInstance);

  return {
    body: {
      success: true,
    },
  };
}

export async function add_instance({ ctx, body }) {
  const parentId = body.parent_id;
  const position = body.position;
  const placement = body.placement;
  const instanceId = body.instance_id;
  const componentId = body.component_id;
  const props = body.props ?? [];
  if (parentId === position)
    throw new Error(
      "Cannot insert component instance here + " + position + " - " + parentId
    );

  let instance_id;
  if (instanceId) {
    const newInstance = await cloneInstance(ctx, instanceId);
    
    instance_id = newInstance[0];
  } else {
    const newInstance = {
      component_id: componentId,
      slot_ids: [],
      props: props.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.name]: curr.value,
        };
      }, {}),
    };

    const insertResult = await ctx.table("instances").insert(newInstance);
    instance_id = insertResult[0];
  }

  const parentInstance = await ctx
    .table("instances")
    .get({ where: { id: parentId } });

  if(!instance_id) {
    throw new Error('instance id is not defined...')
  }

  if(!position) {
    parentInstance.slot_ids.push(instance_id)
  } else {
    const slotIds = []
    for(let slotIndex in parentInstance.slot_ids) {
      const slotId = parentInstance.slot_ids[slotIndex]
      if(slotId === position) {
        console.log('slotId = position', position)
        if(placement === 'before') {
          console.log({placement, slotIds})
          slotIds.push(instance_id, slotId)
        } else if(placement === 'after') {

          console.log({placement, slotIds})
          slotIds.push(slotId, instance_id)
        }

        console.log('after insert', {placement, slotIds})
      } else {
        slotIds.push(slotId)
      }
    }
    console.log({slot_ids: parentInstance.slot_ids, slotIds})
    parentInstance.slot_ids = slotIds
  }
    
  await ctx.table('instances').update(parentInstance.id, parentInstance);

  return {
    body: {
      success: true,
    },
  };
}

export async function update_instance({ ctx, body, params }) {
  const props = body.props;
  const instanceId = body.instance_id;
  console.log('body: ==>: ', body)

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

async function removeInstance(ctx, instance_id) {
  await ctx.table("instances").remove(instance_id);
  const instances = await ctx.table("instances").query({perPage: 100});
  for (let instance of instances.data) {
    if (instance.slot_ids.includes(instance_id)) {
      //
      await ctx.table("instances").update(instance.id, {
        slot_ids: instance.slot_ids.filter((x) => x !== instance_id),
      });
    }
  }
}

export async function remove_instance({ ctx, params, body }) {
  const instanceId = body.instance_id;

  await removeInstance(ctx, instanceId);

  return {
    body: {
      success: true,
    },
  };
}
