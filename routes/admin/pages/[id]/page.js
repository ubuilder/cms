import { View } from "@ulibs/ui"
import { Page } from "../../../../components/Page.js"
import { Components, Pages } from "../../../../models.js"
import { EditorHeader } from "./EditorHeader.js"
import { PreviewModal } from "./PreviewModal.js"
import { Editor } from "../../../editor/[id]/Editor.js"
import { getInstance, renderInstance } from "../../../../utils/render.js"
import { Item } from "../../../editor/[id]/Item.js"
import { Placeholder } from "../../../editor/[id]/Placeholder.js"


export async function load({ctx, params: {id}}) {
    const page = await Pages.get({where: {id}})

    if(!page) throw new Error('Page not found: ' +  id)

    const instance = await getInstance(ctx, page.slot_id);

    const components = await Components.query({perPage: 100}).then(res => res.data)

    const renderedInstance = await renderInstance(ctx, instance, id, {item: Item, placeholder: Placeholder});


    return {
        title: page.title,
        head: page.head,
        components,
        instance: renderedInstance,
    }         
                              
}
export default ({title, instance, components}) => {
    return Page({container: false}, [
        EditorHeader({title}),
        PreviewModal({title, slug: '/preview/' + instance.id}),
        // View({w: 100, tag: 'iframe', style: 'border: none; height: calc(100vh - 112px);', p: 'xs', src: '/editor/' + slot_id})
        View({style: 'padding: var(--size-xs); height: calc(100vh - 112px);'}, [
            Editor({title, instance, components, rootId: instance.id})
        ])
    ])
}


      // EditorHeader({ title }),
      // PreviewModal({ title, slug: "preview/" + rootId }),
