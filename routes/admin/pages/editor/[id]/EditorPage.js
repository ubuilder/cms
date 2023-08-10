import { Col, View } from "@ulibs/ui";
import { Page } from "../../../../../components/Page.js";
import { Styles } from "./styles.js";
import { EditorPageHeader } from "./Header.js";
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

export function EditorPage({ page, components }) {
  return Page(
    {
      container: false,
      $data: {
        clipboard: {},
        placement: "",
        position: "",
        contextmenuOpen: false,
        x: 0,
        y: 0,
        id: "",
      },
      onClick: "id = ''",
    },
    [
      Styles(),
      EditorPageHeader({ page }),
      PageContainer({}, [
        page.content.map((x) => Item({ item: x })),
        page.content.length == 0 && Placeholder({ placement: "after", id: "" }),
      ]),
      ItemModals({ content: page.content }),
      PreviewModal(page),
      ComponentAddModal({ components }),
    ]
  );
}
