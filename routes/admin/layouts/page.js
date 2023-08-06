import { Button, Icon, Input, Textarea, View } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { createModal } from "../../../components/createModal.js";
import { openModal, reload, runAction } from "../../../utils/ui.js";

export async function load({ ctx }) {
  const layouts = await ctx.table("layouts").query({ perPage: 100 });

  return {
    layouts: layouts.data,
  };
}

export async function add_layout({ ctx, body }) {
  const { name, template } = body;

  await ctx.table("layouts").insert({ name, template });

  return {
    body: {
      success: true,
    },
  };
}

export async function update_layout({ ctx, body }) {
  const { id, name, template } = body;

  await ctx.table("layouts").update(id, { name, template });

  return {
    body: {
      success: true,
    },
  };
}

function LayoutList({ layouts }) {
  return View(
    { d: "flex", flexDirection: "column", gap: "sm" },
    layouts.map((layout) => [
      View(
        {
          onClick: openModal(`layout-${layout.id}`),
          p: "sm",
          border: true,
          borderColor: "base-400",
          bgColor: "base-200",
        },
        layout.name
      ),
      createModal({
        $data: layout,
        mode: "edit",
        name: "layout-" + layout.id,
        title: "Edit Layout",
        onEdit: runAction("update_layout", "{id, name, template}", reload()),
        body: [
          Input({ name: "name", label: "Layout Name" }),
          Textarea({ rows: 20, name: "template", label: "Template" }),
        ],
      }),
    ])
  );
}

export default ({ layouts }) => {
  return Page(
    {
      title: "Layouts",
      actions: [
        Button({ href: "/admin/pages" }, [
          Icon({ name: "chevron-left" }),
          "Back",
        ]),
        Button({ color: "primary", onClick: openModal("add-layout") }, [
          Icon({ name: "plus" }),
          "Add Layout",
        ]),
      ],
    },
    [
      LayoutList({ layouts }),

      createModal({
        name: "add-layout",
        title: "Add Layout",
        $data: {
          name: "",
          template: `<!DOCTYPE html>
<html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{page.title}}</title>

  <link rel="stylesheet" href="https://unpkg.com/@ulibs/ui@next/dist/styles.css"/>
  <script src="https://unpkg.com/@ulibs/ui@next/dist/ulibs.js"></script>
    {{{head}}}
  </head>
<body>
  {{{body}}}
</body>
</html>`,
        },
        onAdd: runAction("add_layout", "{name, template}", reload()),
        mode: "add",
        body: [
          Input({ name: "name", label: "Layout Name" }),
          Textarea({ name: "template", rows: 20, label: "Template" }),
        ],
      }),
    ]
  );
};
