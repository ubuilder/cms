import { Button, Col, Icon, Input, Row, View } from "@ulibs/ui";
import { runAction } from "../../../../utils/ui.js";
import { PageHeader } from "../../../../components/PageHeader.js";
import { openPreviewModal } from "./PreviewModal.js";

function EditableTitle({ title }) {
  return View({ d: "flex", $data: { edit_title: false, title } }, [
    View({ d: "flex", $if: "!edit_title" }, [
      View({ style: "text-wrap: nowrap", $text: "title" }),
      Button(
        { link: true },
        Icon({ size: "lg", onClick: "edit_title = true", name: "pencil" })
      ),
    ]),
    Row({ $if: "edit_title" }, [
      Input({ col: true, name: "title" }),
      Col(
        { col: 0 },
        Button(
          {
            onClick:
              "edit_title = false; " + runAction("update_title", "{title}"),
            color: "primary",
          },
          "Save"
        )
      ),
      Col(
        { col: 0 },
        Button(
          {
            onClick: `edit_title = false; title='${title}'`,
          },
          Icon({ name: "x" })
        )
      ),
    ]),
  ]);
}

export function EditorHeader({ title }) {
  return Col(
    { col: 12 },
    PageHeader(
      {
        px: "xs",
        py: "xs",
        title: EditableTitle({ title }),
      },
      [
        Button({ href: "/admin/pages" }, "Back"),
        Button({ onClick: openPreviewModal(), color: "info" }, "Preview"),
        Button({ color: "primary" }, "Publish"),
      ]
    )
  );
}
