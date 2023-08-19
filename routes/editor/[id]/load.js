import { SlotPlaceholder } from "./Placeholder.js";
import { InstanceWrapper} from "./Item.js";
import { renderInstance } from "../../../utils/render.js";

export default async function load({ ctx, params, query }) {
  const id = params.id;
  const page_id = query.page_id

  const instance = await ctx.table('instances').get({where: {id}});
  // Error handling...
  if (!instance) throw new Error("Instance not found: " + id);

  const components = await ctx.table('components').query({ perPage: 100 });

  const page = await ctx.table('pages').get({where: {id: page_id}})

  const html = await renderInstance(ctx, {
    instance,
    instanceWrapper: InstanceWrapper,
    slotPlaceholder: SlotPlaceholder,
  });

  const result = {
    instance,
    html,
    page_id,
    head: page?.head ?? '',
    rootId: id,
    components: components.data,
  };

  return result;
}
