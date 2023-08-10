export async function update({ ctx, body }) {
  const component = {
    name: body.name,
    props: body.props,
  };
  const id = body.id;

  await ctx.table("components").update(id, component);

  return {
    body: {
      success: true,
    },
  };
}
export async function add({ ctx, body }) {
  const component = {
    name: body.name,
    props: body.props,
  };

  const [component_id] = await ctx.table("components").insert(component);

  const default_props = {}
  body.props.map(prop => {
    default_props[prop.name] = prop.default_value
  })
  

  const [id] = await ctx.table('instances').insert({
    component_id,
    props: default_props
  })
  
  await ctx.table('components').update(component_id, {
    slot_ids: [id]
  })

  return {
    body: {
      success: true,
    },
  };
}
