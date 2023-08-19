import { View } from "@ulibs/ui"
import { Page } from "../../../../components/Page.js"
import { EditorHeader } from "./EditorHeader.js"
import { PreviewModal } from "./PreviewModal.js"
import { Editor } from "../../../editor/[id]/Editor.js"
import { renderInstance } from "../../../../utils/render.js"
import { InstanceWrapper } from "../../../editor/[id]/Item.js"
import { SlotPlaceholder } from "../../../editor/[id]/Placeholder.js"

export async function update_title({ ctx, params, body }) {
  const title = body.title;
  const page = await ctx.table('pages').get({where: {id: params.id}});

  await ctx.table('pages').update(page.id, { title });

  return {
    body: {
      success: true,
    },
  };
}

export async function load({ctx, params: {id}}) {
    const page = await ctx.table('pages').get({where: {id}})

    if(!page) throw new Error('Page not found: ' +  id)

    const instance = await ctx.table('instances').get({where: {id: page.slot_id}});

    const components = await ctx.table('components').query({perPage: 100}).then(res => res.data)

    const html = await renderInstance(ctx, {instance, instanceWrapper: InstanceWrapper, slotPlaceholder: SlotPlaceholder});


    return {
        title: page.title,
        head: page.head,
        page,
        page_id: page.id,
        components,
        html,
        instance,
    }         
                              
}
export default ({html, page_id, head, title, page, instance, components}) => {
    return Page({container: false}, [
        EditorHeader({title}),
        // View({w: 100, tag: 'iframe', style: 'border: none; height: calc(100vh - 112px);', p: 'xs', src: '/editor/' + slot_id})
        View({style: 'padding: var(--size-xs); height: calc(100vh - 112px);'}, [
            Editor({head, page_id, html, title, instance, components, rootId: instance.id})
        ]),
        PreviewModal({title, slug: 'preview/' + page.id}),

    ])
}


      // EditorHeader({ title }),
      // PreviewModal({ title, slug: "preview/" + rootId }),
