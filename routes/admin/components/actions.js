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
  
  const default_props = {}
  body.props.map(prop => {
    default_props[prop.name] = {type: 'static', value: prop.default_value}
  })
  

  const [id] = await ctx.table('instances').insert({
    component_id: '000',
    slot_ids: [],
    props: default_props
  })

  const component = {
    name: body.name,
    props: body.props,
    slot_id: id
  };

  await ctx.table("components").insert(component);

  return {
    body: {
      success: true,
    },
  };
}
