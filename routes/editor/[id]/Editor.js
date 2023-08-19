import { Button, Card, CardHeader, Col, Modal, View } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { InstanceWrapper } from "./Item.js";
import { ItemModals } from "./ItemModals.js";
import { ComponentAddModal } from "./ComponentModals.js";

function PageContainer(props, slot) {
  return Col({ col: 12 }, [
    View(
      {
        ...props,
        class: "page-container",
        onKeydown: `onKeydown`,
        tabindex: "0",
      },
      slot
    ),
  ]);
}

function EditComponentModal({page_id} = {}) {
  return Modal({persistent: true, name: 'component-edit-modal', size: 'md'}, [
    Card({style: 'height: 80%'}, [
      CardHeader([
        View({$text: 'component.name'}),
        Button({onClick: 'closeComponentModal'}, "Close")
      ]),
      View({tag: 'iframe', w: 100, h: 100, style: 'border: none', $src: `(component?.slot_id ? '/editor/' + component.slot_id : '') + '?page_id=${page_id}'`})
    ]),
  ])
}

export function Editor({ page_id, html, head, instance, components, rootId }) {

  return Page(
    {
      container: false,
      $data: `page("${rootId}")`,
      onClick: "clearSelection",
      htmlHead: [
        head,
        View({tag: 'link', rel: 'stylesheet', href: '/res/editor/style.css'}),
        View({tag: 'script', src: '/res/editor/script.js'}),
      ]
    },
    [
      PageContainer({}, [ html ]),
      ItemModals({ content: instance }),
      ComponentAddModal({ components }),
      EditComponentModal({page_id})
    ]
  );
}
