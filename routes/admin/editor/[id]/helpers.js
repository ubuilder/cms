export async function getInstance(ctx, id) {
    const instance = await ctx.table('instances').get({where: {id}, with: {
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
    console.log(instance)
  
    return instance;
  }