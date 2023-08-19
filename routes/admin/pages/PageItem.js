import { Badge, Button, Icon, View } from "@ulibs/ui";
import { navigate, openModal, runAction } from "../../../utils/ui.js";
import { AddPageModal, EditPageModal, PageModal } from "./PageModal.js";

export function PageItem({
    title = "",
    id = "",
    slug = "",
    description = "",
    theme = "",
    head = "",
    slot_id,
    is_template = false,
  } = {}) {
    return View(
      {
        $data: { slot_id, is_template },
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
            theme === 'bootstrap' ? Badge({ color: "warning" }, "Bootstrap") : '',
            theme === 'ulibs' ? Badge({ color: "success" }, "ULibs") : '',
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
            href: "/admin/pages/" + id,
          },
          [
            Icon({ name: "pencil" }),
            View({ $text: "is_template ? 'Edit template' : 'Edit page'" }),
          ]
        ),
        Button(
          {
            $if: "is_template",
            mt: "sm",
            color: "primary",
            onClick: openModal("add-page-" + id),
            // href: "/admin/pages/editor/" + id,
          },
          [Icon({ name: "plus" }), "Use this template"]
        ),
        AddPageModal({
          $if: "is_template",
          name: "add-page-" + id,
          onAdd: runAction(
            "add",
            `{title, slug, head, is_template: false, slot_id}`,
            navigate("'/admin/pages/' + res.id")
          ),
          value: { title, slug, description, head: 'head', theme },
        }),
  
        EditPageModal({ id, value: {id, title, slug, description, head: 'head'} }),
      ]
    );
  }