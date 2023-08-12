import {
  Accordion,
  Accordions,
  Button,
  ButtonGroup,
  Card,
  Col,
  Datepicker,
  FormField,
  Icon,
  Input,
  Row,
  Switch,
  CodeEditor,
  Textarea,
  View,
} from "@ulibs/ui";
import { createModal } from "../../../../components/createModal.js";
import { closeModal, reload, runAction } from "../../../../utils/ui.js";

export function ComponentEditForm({ onSubmit }) {
  return Col({ col: 12 }, [
    // View({
    //   $if: "props.length === 0",
    //   $data: { props: [] },
    //   "u-init": onSubmit,
    // }),

    FormField(
      {
        $for: "prop in props",
        label: View({ $text: "prop.name" }),
        style: "position: relative",
      },
      [
        ButtonGroup({ style: "position: absolute; top: 28px; right: 8px" }, [
          Button(
            {
              size: "sm",
              onClick: "prop.value.type = 'load'",
              $color: "prop.value.type === 'load' ? 'primary' : undefined",
            },
            Icon({ name: "database" })
          ),
          Button(
            {
              size: "sm",
              onClick: "prop.value.type = 'static'",
              $color: "prop.value.type === 'static' ? 'primary' : undefined",
            },
            Icon({ name: "star" })
          ),
        ]),
        Row({ $if: "prop.value.type === 'static'" }, [
          Input({
            $col: "prop.col",
            $if: "prop.type === 'plain_text'",
            name: "prop.value",
          }),
          Textarea({
            $col: "prop.col",
            $if: "prop.type === 'rich_text'",
            rows: 10,
            name: "prop.value.value",
          }),
          Input({
            $col: "prop.col",
            $if: "prop.type === 'number'",
            type: "number",
            name: "prop.value.value",
          }),
          CodeEditor({
            $col: "prop.col",
            $if: "prop.type === 'code'",
            lang: "hbs",
            name: "prop.value.value",
          }),
          Datepicker({
            $col: "prop.col",
            $if: "prop.type === 'date'",
            name: "prop.value.value",
          }),
          Switch({
            $col: "prop.col",
            $if: "prop.type === 'boolean'",
            name: "prop.value.value",
          }),
          Col({
            $col: 'prop.col',
            $if: "prop.type === 'array'"
          }, Accordions([
            Card({$for: 'field, index in prop.fields', $col: 'field.col'},[
              Accordion({title: View({$text: "field.name + ' #' + index"}), body: ["BODY"]})
            ])
          ]))
        ]),
        Accordions(
          { $if: "prop.value.type === 'load'", style: "border: none" },
          [
            Card([
              Accordion({
                style: "border-bottom: none",
                header: View(
                  {
                    d: "flex",
                    w: 100,
                    items: "center",
                    justify: "between",
                  },
                  ["Dynamic"]
                ),
                body: [
                  Row([
                    Input({ label: "Table", name: "prop.value.table" }),
                    Input({ label: "Field", name: "prop.value.field" }),

                    "Where...",
                  ]),
                ],
              }),
            ]),
          ]
        ),
      ]
    ),
  ]);
}

export function ConvertToComponentModal({ name, id }) {
  return createModal({
    $data: { name, id },
    title: "Create Component",
    name: `create-component-${id}`,
    body: [Input({ label: "Component Name", name: "name" })],
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          color: "primary",
          onClick: runAction(
            "create_component",
            "{id, name, parent_id}",
            reload()
          ),
        },
        "Create"
      ),
    ],
  });
}

export function ComponentSettingsModal({ id, component, props, onSubmit }) {
  return createModal({
    $data: { props },
    name: `component-${id}-settings`,
    title: "Component Settings",
    actions: [
      Button({ onClick: "$modal.close()" }, "Cancel"),
      component.slot_id
        ? Button(
            { href: "/admin/editor/" + component.slot_id },
            "Edit Component"
          )
        : "",
      Button(
        {
          onClick: onSubmit,
          color: "primary",
        },
        "Save"
      ),
    ],
    body: ComponentEditForm({ onSubmit }),
  });
}

export function ComponentRemoveModal({ id }) {
  return createModal({
    name: `component-${id}-remove`,
    title: "Remove Component",
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          onClick: runAction("remove_instance", `{id: '${id}'}`, reload()),
          color: "error",
        },
        "Remove"
      ),
    ],
    body: "Are you sure to remove this component from Page?",
  });
}

export function getPropsArray({ component, props }) {
  const result = [];

  console.log("getPropsArray", { component, props });
  for (let prop of component.props) {
    result.push({
      name: prop.name,
      value: props[prop.name] ?? {
        type: "static",
        value: prop.default_value,
      },
      type: prop.type,
    });
  }

  return result;
}

export function ItemModal({ item = { props: {}, component: {} } }) {
  if (typeof item === "string") return;
  console.log("PROPS: ", item.props);
  const props = getPropsArray({ component: item.component, props: item.props });

  return [
    ComponentRemoveModal({ id: item.id }),
    ComponentSettingsModal({
      id: item.id,
      props,
      component: item.component,
      onSubmit: runAction(
        "update_instance",
        `{id: '${item.id}', props}`,
        reload()
      ),
    }),
    ConvertToComponentModal({ name: item.component.name, id: item.id }),
  ];
}

export function ItemModals({ content }) {
  console.log("CONTENT: ", content);
  let result = [ItemModal({ item: content })];

  if (content.slot) {
    console.log("SLOT: ", content.slot);
    result = [
      ...result,
      ...content.slot.map((item) => ItemModals({ content: item })),
    ];
  }

  return result;
}
