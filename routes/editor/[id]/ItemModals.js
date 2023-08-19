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
  Badge,
  Select,
} from "@ulibs/ui";
import { createModal } from "../../../components/createModal.js";
import { closeModal, reload, runAction } from "../../../utils/ui.js";

export function ComponentEditForm() {
  return Col({ col: 12 }, [
    FormField(
      {
        $for: "prop, index in props",
        label: View({ d: "flex", gap: "xs" }, [
          View({ $text: "prop.name" }),
          Badge({
            onClick: `toggleType(index)`,
            $text: `isStatic(index) ? 'Static' : 'Dynamic'`,
            $color: `isStatic(index) ? 'base' : 'primary'`,
          }),
        ]),
        style: "position: relative",
      },
      [
        Row({ $if: "isStatic(index)" }, [
          Input({
            $col: "prop.col",
            $if: "prop.type === 'plain_text'",
            name: "prop.value.value",
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
          Col(
            {
              col: 12,
              "u-bind:u-col-col": "prop.col",
              $if: "prop.type === 'array'",
            },
            [
              Accordions(
                { $if: "prop.value.value.length > 0", style: "border: none" },
                [
                  Card(
                    { $for: "value, index in prop.value.value", mb: "xxs" },
                    [
                      Accordion({
                        style: "border: none",
                        header: [View({ $text: "'Item #' + index" })],
                        body: [
                          Col(
                            { $for: "field in prop.fields", $col: "field.col" },
                            [
                              Input({
                                name: "value[field.name]",
                                label: View({
                                  $text: "field.name",
                                }),
                              }),
                            ]
                          ),
                        ],
                      }),
                    ]
                  ),
                ]
              ),
              Button({ onClick: "prop.value.value.push({})" }, [
                Icon({ name: "plus" }),
                "Add",
              ]),
            ]
          ),
        ]),
        Row({ $if: "!isStatic(index)" }, [
          Select({
            class: "dynamic-prop-select",
            items: ["a", "b", "c", "slug"],
            name: "prop.value.dynamic_value",
          }),
        ]),
      ]
    ),
  ]);
}

export function ConvertToComponentModal({ name, instance_id }) {
  return createModal({
    $data: { name, instance_id },
    title: "Create Component",
    name: `create-component-${instance_id}`,
    body: [Input({ label: "Component Name", name: "name" })],
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          color: "primary",
          onClick: "onCreateComponent({instance_id, name, parent_id})",
        },
        "Create"
      ),
    ],
  });
}

export function ComponentSettingsModal({ id, component, props, onSubmit }) {
  return [
    View({tag: 'script', type: 'text/json', id: 'prop-' + id}, JSON.stringify(props)),
    View({tag: 'script', type: 'text/json', id: 'component-' + id}, JSON.stringify({...component, slot: undefined})),
    createModal({
    $data: `componentSettings("${id}")`,
    name: `component-${id}-settings`,
    title: "Component Settings",
    actions: [
      Button({ onClick: "$modal.close()" }, "Cancel"),
      component.slot_id
        ? Button(
            { onClick: `openComponentModal("${id}")` },
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
    body: ComponentEditForm(),
  })
];
}

export function ComponentRemoveModal({ id }) {
  return createModal({
    name: `component-${id}-remove`,
    title: "Remove Component",
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          onClick: `onRemoveInstance({instance_id: '${id}'}).then(res => location.reload())`,
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

  for (let prop of component.props) {
    result.push({
      name: prop.name,
      value: props[prop.name] ?? {
        type: "static",
        value: prop.type === "array" ? [] : prop.default_value,
      },
      type: prop.type,
      fields: prop.type === "array" ? prop.fields : [],
    });
  }

  return result;
}

export function ItemModal({ item = { props: {}, component: {} } }) {
  if (typeof item === "string") return;
  const props = getPropsArray({ component: item.component, props: item.props });

  return [
    ComponentRemoveModal({ id: item.id }),
    ComponentSettingsModal({
      id: item.id,
      props,
      component: item.component,
      onSubmit: `onUpdateInstance({instance_id: '${item.id}', props}).then(res => location.reload())`,
    }),
    ConvertToComponentModal({ name: item.component.name, instance_id: item.id }),
  ];
}

export function ItemModals({ content }) {

  let result = [ItemModal({ item: content })];

  if (content.slots) {
    result = [
      ...result,
      ...content.slots.map((slot) => ItemModals({ content: slot })),
    ];
  }

  return result;
}
