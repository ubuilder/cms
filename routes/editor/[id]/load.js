import { SlotPlaceholder } from "./Placeholder.js";
import { InstanceWrapper} from "./Item.js";
import { renderInstance } from "../../../utils/render.js";
import { Components, Instances } from "../../../models.js";

export default async function load({ ctx, params }) {
  const id = params.id;

  const instance = await Instances.get({where: {id}});
  // Error handling...
  if (!instance) throw new Error("Instance not found: " + id);

  const components = await Components.query({ perPage: 100 });

  const html = await renderInstance({
    instance,
    instanceWrapper: InstanceWrapper,
    slotPlaceholder: SlotPlaceholder,
  });

  console.log('HERE: ', {html})

  // await renderInstance(ctx, instance, props)

  const result = {
    title: "TITLE",
    instance,
    html,
    rootId: id,
    components: components.data,
  };

  return result;
}
