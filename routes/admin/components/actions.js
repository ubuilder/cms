import { Components, Instances } from "../../../models.js";

export async function update({ body }) {
  const component = {
    name: body.name,
    props: body.props,
  };
  const id = body.id;

  await Components.update(id, component);

  return {
    body: {
      success: true,
    },
  };
}
export async function add({ body }) {
  
  const default_props = {}
  body.props.map(prop => {
    default_props[prop.name] = {type: 'static', value: prop.default_value}
  })
  

  const [id] = await Instances.insert({
    component_id: '000',
    slot_ids: [],
    props: default_props
  })

  const component = {
    name: body.name,
    props: body.props,
    slot_id: id
  };

  await Components.insert(component);

  return {
    body: {
      success: true,
    },
  };
}
