import {
  Button,
  Icon,
  View,
} from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { navigate, openModal, runAction } from "../../../utils/ui.js";
import { AddPageModal, PageModal } from "./PageModal.js";
import { PageItem } from "./PageItem.js";


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
