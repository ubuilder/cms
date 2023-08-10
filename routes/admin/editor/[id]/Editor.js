import { Col, View } from "@ulibs/ui";
import { Page } from "../../../../components/Page.js";
import { Styles } from "./styles.js";
import { EditorHeader } from "./EditorHeader.js";
import { Item } from "./Item.js";
import { Placeholder } from "./Placeholder.js";
import { ItemModals } from "./ItemModals.js";
import { PreviewModal } from "./PreviewModal.js";
import { ComponentAddModal } from "./ComponentModals.js";

function PageContainer(props, slot) {
  return Col({ col: 12 }, [
    View(
      {
        ...props,
        style:
          "height: calc(100vh - 132px); overflow-y: auto; outline: none; box-shadow: 0 0 4px var(--color-base-700);",
        onKeydown: `if($event.code === 'Space')  {$modal.open('component-' + id + '-settings')} else if($event.code ===   'Escape') {id = ''}`,
        bgColor: "base-100",
        tabindex: "0",
        m: "xs",
        h: 100,
        border: true,
        borderColor: "base-700",
      },
      slot
    ),
  ]);
}

export function Editor({ title, instance, components, rootId }) {
  return Page(
    {
      container: false,
      $data: {
        clipboard: {},
        placement: "",
        position: "",
        parent_id: '',
        contextmenuOpen: false,
        x: 0,
        y: 0,
        id: "",
      },
      onClick: "id = ''",
    },
    [
      Styles(),
      EditorHeader({ title }),
      PageContainer({}, [
        Item({ item: instance, rootId }),
        // Placeholder({ placement: "after", id: "" }),
      ]),
      ItemModals({ content: instance }),
      PreviewModal({title, slug: 'preview/' + rootId}),
      ComponentAddModal({ components }),
    ]
  );
}
