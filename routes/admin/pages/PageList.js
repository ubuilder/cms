import { Badge, Button, Icon, Input, Select, Textarea, View } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { openModal, reload, runAction } from "../../../utils/ui.js";
import { createModal } from "../../../components/createModal.js";

function PageItem({
  title = "",
  id = "",
  layout_id = "",
  slug = "",
  head = "",
  layouts,
} = {}) {
  return View(
    { border: true, borderColor: "base-400", bgColor: "base-200", p: "sm" },
    [
      View({ tag: "h3", d: "flex", justify: "between", align: "center" }, [
        title,
        Button(
          { color: "primary", href: "/preview/" + id },
          Icon({ name: "external-link" })
        ),
      ]),
      Button(
        {
          mt: "sm",
          onClick: openModal("page-" + id),
        },
        [Icon({ name: "settings" }), "Settings"]
      ),
      Button(
        {
          mt: "sm",
          href: "/admin/pages/editor/" + id,
        },
        [Icon({ name: "pencil" }), "Edit"]
      ),

      PageModal({
        name: "page-" + id,
        mode: "edit",
        onEdit: runAction(
          "update_page",
          `{id: '${id}',title, slug, layout_id, head}`
        ),
        layouts,
        value: { title, slug, layout_id, head },
      }),
    ]
  );
}

function PageModal({
  name = "add-page",
  onAdd = "",
  onEdit = "",
  mode = "add",
  value = { title: "", slug: "", layout_id: "" },
  layouts = [],
}) {
  return createModal({
    name,
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
        items: layouts,
        key: "id",
        text: "name",
        name: "layout_id",
        placeholder: "Choose a layout",
      }),
      mode === "edit" && Textarea({ name: "head", label: "Head" }),
    ],
  });
}

export function PageList({ pages, layouts }) {
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
        pages.map((page) => PageItem({ ...page, layouts }))
      ),
      PageModal({
        onAdd: runAction(
          "add",
          "{title, slug, layout_id, head: '', content: []}",
          reload()
        ),
        layouts,
      }),
    ]
  );
}
