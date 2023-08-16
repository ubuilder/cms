import { Instances } from "../models.js"

export async function cloneInstance(instance_id) {
    console.log({instance_id})
    const instance = await Instances.get({where: {id: instance_id}})
  
    const slot_ids = []
    
    if(!instance) throw new Error('Instance not found: ' + instance_id)
  
    for(let slotId of instance.slot_ids) {
      const [newId] = await cloneInstance(slotId)
      slot_ids.push(newId);
    }
    
  
    return Instances.insert({
      component_id: instance.component_id,
      props: instance.props,
      slot_ids
    })
  }