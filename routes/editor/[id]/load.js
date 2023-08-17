import { SlotPlaceholder } from "./Placeholder.js";
import { InstanceWrapper} from "./Item.js";
import { renderInstance } from "../../../utils/render.js";

export default async function load({ ctx, params }) {
  const id = params.id;

  const instance = await ctx.table('instances').get({where: {id}});
  // Error handling...
  if (!instance) throw new Error("Instance not found: " + id);

  const components = await ctx.table('components').query({ perPage: 100 });

  const html = await renderInstance(ctx, {
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
