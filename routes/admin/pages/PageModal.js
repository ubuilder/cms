import { Input, Textarea, CodeEditor, Button, View, Col } from "@ulibs/ui";
import { createModal } from "../../../components/createModal.js";
import { navigate, reload, runAction } from "../../../utils/ui.js";

export function PageModal({
  name = "add-page",
  onAdd = "",
  onEdit = "",
  mode = "add",
  size = "md",
  value = {
    title: "",
    slug: "",
    head: "",
    description: "",
    is_template: false,
  },
}) {
  return createModal({
    size,
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
        if: "!is_template",
        label: "Slug",
        name: "slug",
        placeholder: "Enter url part of page /about-us, /blogs/{slug}, ...",
      }),
      Textarea({ name: "description", label: "Description" }),

      (mode === "edit" && [
        (false && CodeEditor({ name: "head", lang: "hbs", label: "Head" })) ||
          "",

        Col({ col: 12 }, View("Data (load data from database)")),
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
        View({ w: 100 }),
        Button(
          {
            mt: "sm",
            onClick: runAction("remove_page", `{id}`, reload()),
            color: "error",
          },
          [
            View({ $if: "is_template" }, "Remove template"),
            View({ $if: "!is_template" }, "Remove page"),
          ]
        ),
      ]) ||
        "",
    ],
  });
}

export function AddPageModal({ ...props }) {
  return PageModal({
    size: "xs",
    onAdd: runAction(
      "add",
      "{title, slug, description, is_template}",
      navigate("'/admin/pages/' + res.id")
    ),
    ...props,

  });
}

export function EditPageModal({ value, ...props }) {
  return PageModal({
    ...props,
    name: "page-" + value.id,
    mode: "edit",
    size: "md",
    onEdit: runAction(
      "update_page",
      `{id ,title, slug, description, head, is_template: false}`
    ),
    value
  });
}
