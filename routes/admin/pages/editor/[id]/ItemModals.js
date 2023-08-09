import { Accordion, Accordions, Button, ButtonGroup, Card, Col, Datepicker, FormField, Icon, Input, Row, Switch, Textarea, View } from "@ulibs/ui";
import { createModal } from "../../../../../components/createModal.js";
import { closeModal, reload, runAction } from "../../../../../utils/ui.js";

export function ComponentEditForm({ onSubmit }) {
  return Col({ col: 12 }, [
    View({
      $if: "props.length === 0",
      $data: { props: [] },
      "u-init": onSubmit,
    }),

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
            $if: "prop.type === 'plain_text'",
            name: "prop.value.value",
          }),
          Textarea({
            $if: "prop.type === 'rich_text'",
            rows: 10,
            name: "prop.value.value",
          }),
          Input({
            $if: "prop.type === 'number'",
            type: "number",
            name: "prop.value.value",
          }),
          Datepicker({
            $if: "prop.type === 'date'",
            name: "prop.value.value",
          }),
          Switch({
            $if: "prop.type === 'boolean'",
            name: "prop.value.value",
          }),
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

export function ConvertToComponentModal({name, id}) {
  return createModal({
    $data: { name, id },
    title: "Convert to Component",
    name: `convert-component-${id}`,
    body: [Input({ label: "Component Name", name: "name" })],
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          color: "primary",
          onClick: runAction("convert_to_component", "{id, name}", reload()),
        },
        "Create"
      ),
    ],
  });
}

export function ComponentSettingsModal({id, props, onSubmit}) {
  return createModal({
    $data: { props },
    name: `component-${id}-settings`,
    title: "Component Settings",
    actions: [
      Button({ onClick: "$modal.close()" }, "Cancel"),
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

export function ComponentRemoveModal({id}) {
  return createModal({
    name: `component-${id}-remove`,
    title: "Remove Component",
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          onClick: runAction(
            "remove_component",
            `{id: '${id}'}`,
            reload()
          ),
          color: "error",
        },
        "Remove"
      ),
    ],
    body: "Are you sure to remove this component from Page?",
  });
}

export function getPropsArray({component, props}) {
  const result = [];

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

export function ItemModal({
  item = { props: {} },
}) {
  const props = getPropsArray({component: item.component, props: item.props});
 
  return [
    ComponentRemoveModal({id: item.id}),
    ComponentSettingsModal({id: item.id, props, onSubmit: runAction("set_props", `{id: '${item.id}', props}`, reload())}),
    ConvertToComponentModal({name: item.component.name, id: item.id})
  ];                                  
}

export function ItemModals({content}) {
    let result = []

    content.map(item => {
        result = [...result, ItemModal({item})]
    
        if(item.slot) {
            result = [...result, ...ItemModals({content: item.slot})]
        }
    })

    return result;
}