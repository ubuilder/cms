import { Placeholder } from "./Placeholder.js";
import { Item } from "./Item.js";
import { getInstance } from "./helpers.js";
import { renderInstance } from "../../../utils/render.js";
import { Components } from "../../../models.js";

export default async function load({ ctx, params }) {
  const id = params.id;

  const instance = await getInstance(ctx, id);
  // Error handling...
  if(!instance) throw new Error('Instance not found: ' + id);

  const components = await Components.query({ perPage: 100 });

  const instance2 = await renderInstance(ctx, instance, id, {item: Item, placeholder: Placeholder});

  // await renderInstance(ctx, instance, props)

  const result = {
    title: "TITLE",
    instance: instance2,
    rootId: id,
    components: components.data,
  };

  return result;
}
