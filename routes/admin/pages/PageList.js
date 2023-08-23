import {
  Button,
  Icon,
  View,
} from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { navigate, openModal, runAction } from "../../../utils/ui.js";
import { AddPageModal, PageModal } from "./PageModal.js";
import { PageItem } from "./PageItem.js";
import { Filter } from "../../../components/filters/Filter.js";


export function PageList({ pages }) {
  return Page(
    {
      title: "Pages",
      actions: [
        Button({ href: "/admin/components" }, "Components"),
        Button({ onClick: openModal("add-page"), color: "primary" }, [
          Icon({ name: "plus" }),
          "Add Page",
        ]),
      ],
      filters: [
        Filter({
          text: 'Type',
          items: [{key: true, text: 'Template'},{key: false, text: 'Page'}],
          key: 'is_template'
        }),
        Filter({
          text: 'Title',
          type: 'text',
          key: 'title'
        }),
        Filter({
          text: 'Theme',
          items: [{key: 'bootstrap', text: 'Bootstrap'},{key: 'ulibs', text: 'ULibs'}],
          key: 'theme'
        }),
      ]
    },
    [
      View(
        { d: "flex", gap: "sm", flexDirection: "column" },
        pages.map((page) => PageItem(page))
      ),
      AddPageModal({}),
    ]
  );
}
