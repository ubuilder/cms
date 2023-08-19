export async function cloneInstance(ctx, instance_id) {
    const instance = await ctx.table('instances').get({where: {id: instance_id}})
  
    const slot_ids = []
    
    if(!instance) throw new Error('Instance not found: ' + instance_id)
  
    for(let slotId of instance.slot_ids) {
      const [newId] = await cloneInstance(ctx, slotId)
      slot_ids.push(newId);
    }
    
  
    return await ctx.table('instances').insert({
      component_id: instance.component_id,
      props: instance.props,
      slot_ids
    })
  }