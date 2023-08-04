import { Badge, Button, Icon, Input, Select, View } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { openModal, reload, runAction } from "../../../utils/ui.js";
import { createModal } from "../../../components/createModal.js";

function PageItem({ title = "", id = "", layout = "", version = 1 } = {}) {
  return View({}, [
    View({ tag: "h3" }, title),
    Badge({ color: "primary" }, version),
    
    Button(
      {
        mt: "sm",
        color: "primary",
        href: "/admin/pages/editor/" + id,
      },
      [Icon({ name: "external-link" }), "Edit"]
    ),
  ]);
}

function PageModal({
  onAdd = "",
  onEdit = "",
  mode = "add",
  value = { title: "", slug: "", layout: "" },
}) {
  return createModal({
    name: "add-page",
    $data: value,
    mode,
    onAdd,
    onEdit,
    title: mode === "add" ? "Add Page" : "Edit Page",
    body: [
      Input({
        label: "Title",
        name: "title",
        placeholder: "Enter title of page",
      }),
      Input({
        label: "Slug",
        name: "slug",
        placeholder: "Enter url part of page /about-us, /blogs/{slug}, ...",
      }),
      Select({
        label: "Layout",
        items: ["empty", "layout-1", "layout-2"],
        name: "layout",
        placeholder: "Choose a Layout",
      }),
    ],
  });
}

export function PageList({ pages }) {
  return Page(
    {
      title: "Pages",
      actions: [
        Button({ href: "/admin/components" }, "Components"),
        Button({ href: "/admin/layouts" }, "Layouts"),
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
      PageModal({
        onAdd: runAction(
          "add",
          "{title, slug, layout, head: '', template: ''}",
          reload()
        ),
      }),
    ]
  );
}
