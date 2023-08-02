import {
  Accordion,
  Accordions,
  Badge,
  Button,
  Card,
  Col,
  FormField,
  Icon,
  Input,
  Row,
  Textarea,
  View,
} from "@ulibs/ui";
import { createModal } from "../../../components/createModal.js";
import { Page } from "../../../components/Page.js";
import { openModal, reload, runAction } from "../../../utils/ui.js";

export async function load({ ctx }) {
  const Components = ctx.table("components");

  const result = await Components.query({ perPage: 100 });

  return {
    components: result.data,
  };
}

export async function update({ ctx, body }) {
  const component = {
    name: body.name,
    slug: slugify(body.name),
    props: body.props,
    template: body.template,
  };
  const id = body.id;

  await ctx.table("components").update(id, component);

  return {
    body: {
      success: true,
    },
  };
}
export async function add({ body }) {
  const component = {
    name: body.name,
    slug: slugify(body.name),
    props: body.props,
    template: body.template,
    version: 1,
  };

  await ctx.table("components").insert(component);

  return {
    body: {
      success: true,
    },
  };
}

function ComponentModal({
  onAdd = "",
  onEdit = "",
  name = "add-component",
  mode = "add",
  value = { props: [], name: "", template: "", new_name: "" },
}) {
  function Props({ label, description, name }) {
    return FormField({ label, description }, [
      Accordions({ $for: `prop, index in ${name}`, style: "border: none" }, [
        Card({ mb: "xxs" }, [
          Accordion({
            style: "border: none",
            header: [View({ $text: "prop.name" }), Badge("Tags")],
            body: [
              Row([
                Input({ colXs: 6, label: "Name", name: "prop.name" }),
                Input({ colXs: 6, label: "Type", name: "prop.type" }),
                Input({ label: "Default Value", name: "prop.default_value" }),

                Col({ d: "flex", justify: "end", col: 12 }, [
                  Button(
                    {
                      onClick: `${name}.splice(index, 1)`,
                      size: "sm",
                      color: "error",
                    },
                    "Remove"
                  ),
                ]),
              ]),
            ],
          }),
        ]),
      ]),
      Row({ mt: "sm" }, [
        Input({
          col: true,
          placeholder: "Enter name of new prop...",
          name: "new_name",
        }),
        Col({ col: 0 }, [
          Button(
            {
              onClick: `${name}.push({name: new_name, type: 'string', default_value: ''}); new_name = ''`,
            },
            [Icon({ name: "plus" }), "Add Prop"]
          ),
        ]),
      ]),
    ]);
  }

  return createModal({
    name,
    mode,
    onAdd,
    onEdit,
    $data: value,
    title: mode === "add" ? "Add Component" : "Edit Component",
    body: [
      Input({
        label: "Name",
        name: "name",
        description: "Name of the component",
      }),
      Props({
        name: "props",
        label: "Props",
        description: "any prop that you add, will be accessible in template",
      }),
      Textarea({
        name: "template",
        label: "Template",
        description: "use { and } to access to props",
        placeholder: "Hello {name}!",
      }),
    ],
  });
}

export default ({ components }) => {
  function Component({ id, name, props, template }) {
    return [
      Card(
        {
          onClick: openModal("edit-component-" + id),
          border: true,
          p: "sm",
          w: "auto",
          d: "inline-flex",
          align: "center",
          justify: "center",
          borderColor: "base-400",
          borderRadius: "md",
        },
        [View({ tag: "h3" }, name)]
      ),
      ComponentModal({
        mode: "edit",
        onEdit: runAction(
          "update",
          `{id: ${id}, name, props, template}`,
          reload()
        ),
        name: `edit-component-${id}`,
        value: { name, props, template, new_name: "" },
        size: "xs",
      }),
    ];
  }
  return Page(
    {
      title: "Components",
      actions: [
        Button({ href: "/admin/pages" }, [
          Icon({ name: "chevron-left" }),
          "Back",
        ]),
        Button({ color: "primary", onClick: openModal("add-component") }, [
          Icon({ name: "plus" }),
          "Add Component",
        ]),
      ],
    },
    [
      View({ d: "flex", wrap: true, gap: "sm" }, [
        components.map((component) =>
          Component({
            name: component.name,
            props: component.props,
            template: component.template,
            id: component.id,
          })
        ),
      ]),
      ComponentModal({
        onAdd: runAction("add", `{name, props, template}`, reload()),
      }),
    ]
  );
};