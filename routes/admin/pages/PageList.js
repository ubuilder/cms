import {
  Badge,
  Button,
  Icon,
  Input,
  Select,
  Switch,
  Textarea,
  View,
} from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { navigate, openModal, reload, runAction } from "../../../utils/ui.js";
import { createModal } from "../../../components/createModal.js";

function PageItem({
  title = "",
  id = "",
  slug = "",
  head = "",
  slot_id,
  is_template = false,
} = {}) {
  return View(
    {
      $data: { is_template },
      border: true,
      borderColor: "base-400",
      bgColor: "base-200",
      p: "sm",
    },
    [
      View({ d: "flex", justify: "between", align: "center" }, [
        View({ d: "flex", gap: "md", align: "center" }, [
          View({ tag: "h3" }, title),
          Badge({ $if: "is_template", color: "primary" }, "Template"),
        ]),
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
          href: "/admin/editor/" + slot_id,
        },
        [Icon({ name: "pencil" }), View({$text: "is_template ? 'Edit template' : 'Edit page'"})]
      ),
      Button(
        {
          $if: 'is_template',
          mt: "sm",
          color: 'primary',
          onClick: openModal('add-page-' + id)
          // href: "/admin/pages/editor/" + id,
        },
        [Icon({ name: "plus" }), "Use this template"]
      ),
      PageModal({
        $if: 'is_template',
        name: "add-page-" + id,
        mode: "add",
        onAdd: runAction(
          "add",
          `{title, slug, head, is_template: false}`,
          navigate("'/admin/editor/' + res.id")
        ),
        value: { title, slug, head, },
      }),

      PageModal({
        name: "page-" + id,
        mode: "edit",
        onEdit: runAction(
          "update_page",
          `{id: '${id}',title, slug, head,  is_template: false}`
        ),
        value: { id, title, slug,  head },
      }),
    ]
  );
}

function PageModal({
  name = "add-page",
  onAdd = "",
  onEdit = "",
  mode = "add",
  value = { title: "", slug: "", description: "", is_template: false },
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
        if: '!is_template',
        label: "Slug",
        name: "slug",
        placeholder: "Enter url part of page /about-us, /blogs/{slug}, ...",
      }),
      Textarea({ name: "description", label: "Description" }),

      (mode === "edit" && [
        Textarea({ name: "head", label: "Head" }),


      Button(
        {
          my: "md",
          onClick: runAction("convert_to_template", `{id}`, reload()),
          $if: "!is_template",
        },
        "Convert to template"
      ),
      Button(
        {
          mt: "sm",
          onClick: runAction("convert_to_page", `{id}`, reload()),
          $if: "is_template",
        },
        "Convert to page"
      ),
      View({w: 100}),
      Button(
        {
          mt: "sm",
          onClick: runAction("remove_page", `{id}`, reload()),
          color: 'error'
        },
        [View({$if: 'is_template'}, "Remove template"),
        View({$if: '!is_template'}, "Remove page")]
      ),

      ] || '')
    ],
  });
}

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
      PageModal({
        onAdd: runAction("add", "{title, slug, description, is_template}", navigate("'/admin/editor/' + res.id")),
      }),
    ]
  );
}
