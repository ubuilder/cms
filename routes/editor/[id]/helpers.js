import { Instances } from "../../../models.js";


// export async function getInstance(ctx, id) {
//   const instance = await Instances.get({
//     where: { id },
//     with: {
//       component: {
//         table: "components",
//         field: "component_id",
//       },
//     },
//   });
//   if (!instance) throw new Error("instance not found: " + id);

//   instance.slot = []

//   for(let slotId of instance.slot_ids) {
//     const slotItem = await getInstance(ctx, slotId);
//     instance.slot.push(slotItem)
//   }

//   return instance;
// }