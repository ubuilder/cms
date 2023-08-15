import { Instances } from "../../../models.js";

export async function getInstance(ctx, id) {
    const instance = await Instances.get({where: {id}, with: {
      component:  {
        table: 'components',
        field: 'component_id'
      }
    }});
  
    if(!instance) return;
    
    for(let slotId of instance.slot_ids ?? []) {
      instance.slot ??= []
      instance.slot.push(await getInstance(ctx, slotId))
    }
  
    return instance;
  }