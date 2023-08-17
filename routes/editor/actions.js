import { id } from "@ulibs/db";
import { cloneInstance } from "../../utils/instance.js";



export async function create_component({ ctx, body, params }) {
  const { id, parent_id = params.id, name } = body;

  const newComponent = {
    name,
    slot_id: id,
    props: [],
  };

  const [component_id] = await ctx.table('components').insert(newComponent);

  // create instance of new component and replace in page
  const [instanceId] = await ctx.table('instances').insert({
    component_id,
    props: {},
    slot_ids: [],
  });

  const parentInstance = await ctx.table('instances').get(parent_id);

  parentInstance.slot_ids = parentInstance.slot_ids.map((x) => {
    if (x === id) return instanceId;
    return x;
  });

  await ctx.table('instances').update(parentInstance.id, parentInstance);

  return {
    body: {
      success: true,
    },
  };
}

export async function add_instance({ ctx, body }) {
  console.log('add instance', body)
  const parentId = body.parent_id
  const position = body.position
  const placement = body.placement
  const instanceId = body.instance_id
  const componentId = body.component_id
  const props = body.props ?? []
  if(parentId === position) throw new Error('Cannot insert component instance here + ' + position + ' - ' + parentId)
  

  let instance_id;
  if (instanceId) {
    const newInstance = await cloneInstance(ctx, body.instance_id);

    instance_id = newInstance[0];

  } else {


  const newInstance = {
    id: id(),
    component_id: componentId,
    slot_ids: [],
    props: props.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.name]: curr.value,
      };
    }, {}),
  };

  const [instanceId] = await ctx.table('instances').insert(newInstance);
  instance_id = instanceId
}


console.log({instance_id})

  const parentInstance = await ctx
    .table("instances")
    .get({ where: { id: parentId } });


  console.log({parentInstance})
  if (!position) {
    parentInstance.slot_ids.push(instance_id);
  } else {
    let slotIds = [];

    for (let slotId of parentInstance.slot_ids) {
      if (slotId === position) {
        if (placement === "before") {
          slotIds.push(instance_id);
          slotIds.push(slotId);
        } else if (placement === "after") {
          slotIds.push(slotId);
          slotIds.push(instance_id);
        } else {
          // inside
        }
      } else {
        slotIds.push(slotId);
      }
    }
    parentInstance.slot_ids = slotIds;
  }

  console.log({parentInstance})

  await ctx.table('instances').update(parentId, {
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
  const instanceId = body.instance_id;


  await ctx.table('instances').update(instanceId, {
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
  await ctx.table('instances').remove(instance_id);
  const instances = await ctx.table('instances').query({})
  for(let instance of instances.data) {
    if(instance.slot_ids.includes(instance_id)) {
      // 
      await ctx.table('instances').update(instance.id, {
        slot_ids: instance.slot_ids.filter(x => x !== instance_id)
      })
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
