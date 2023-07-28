import {
  Accordion,
  Accordions,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  FormField,
  Icon,
  Input,
  Row,
  Select,
  Switch,
  View,
} from "@ulibs/ui";
import { IconPicker } from "../../components/IconPicker.js";

export function TableEditor({
  submitText = "Create",
  value = { id: "", table_name: "", type: 'text', icon: "database", fields: [] },
  successMessage = "Table created successfully",
  ...$props
}) {
  const addField =
    "fields.push({\
      name: 'new',\
      type: 'text',\
      hint: '',\
      default_value: '',\
      new: true,\
      removed: false,\
      required: false,\
      default_active: false\
    })";

  const onSumbit = `\
  $post('?${$props.action}', {\
    id, name: table_name, icon, fields\
  })\
  .then(async res => {\
    await $routing.goto('/data/' +$data.slug); \
      $alert.success('${successMessage}')\
    })\
`;

  return Row(
    {
      ...$props,
      $data: value,
    },
    [
      FormField(
        { label: "Icon:", col: 0 },
        IconPicker({ value: value.icon ?? "database", name: "icon" })
      ),
      (value.id &&
        Input({ d: "none", name: "id", type: "hidden", value: value.id })) ||
        [],
      Input({
        col: true,
        name: "table_name",
        placeholder: "Enter Table name (Posts, Users, ...)",
        label: "Name:",
        value: value.name,
      }),

      FormField({ label: "Fields" }, [
        Accordions({ $if: "fields.length > 0", style: "border: none" }, [
          Card({ mt: "xxs", $for: "(field, index) in fields" }, [
            Accordion({
              style: 'border: none',
              header: [
                View({ d: "flex", align: "center", gap: "xs" }, [
                  View({ tag: "span", $text: "field.name" }),
                  Badge(
                    { color: "primary", $show: `field.required` },
                    "Required"
                  ),
                  Badge({ color: "warning", $if: `field.new` }, "New"),
                  Badge({ color: "error", $if: `field.removed` }, "Remove"),
                ]),
                View({$if:'field.removed', onClick: '$event.stopPropagation(); field.removed = false'}, 'Restore')
              ],
              body: Row({$style: "field.removed ? 'opacity: 0.5' : ''"}, [
                Input({ $disabled: 'field.removed', colSm: 6, label: "Name", name: "field.name" }),
                Select({
                  $disabled: 'field.removed',
                  name: "field.type",
                  colSm: 6,
                  label: "Type",
                  items: ["text", "number", "date", "image", "reference"],
                }),
                Input({ $disabled: 'field.removed', col: 12, label: "Hint" }),
                Switch({
                  $disabled: 'field.removed',
                  colSm: 6,
                  name: "field.required",
                  label: "Required?",
                }),
                FormField(
                  {
                    colSm: 6,
                    label: View(
                      { d: "flex", align: "center", justify: "between" },
                      [
                        "Default Value",
                        Switch({
                          $disabled: 'field.removed',
                          name: "field.default_active",
                          col: 0,
                          d: "flex",
                          mb: 0,
                          p: 0,
                          justify: "end",
                        }),
                      ]
                    ),
                  },
                  Row([
                    Input({
                      $disabled: `!field.default_active`,

                      col: 12,
                      name: "field.default_value",
                    }),
                  ])
                ),

                FormField({ label: "Summary" }, [
                  Row([
                    Col({ col: 6 }, [
                      "name:",
                      View({ tag: "span", $text: "field.name" }),
                    ]),
                    Col({ col: 6 }, [
                      "type:",
                      View({ tag: "span", $text: "field.type" }),
                    ]),
                    Col({ col: 6 }, [
                      "default_active:",
                      View({ tag: "span", $text: "field.default_active" }),
                    ]),
                    Col({ col: 6 }, [
                      "default_value:",
                      View({ tag: "span", $text: "field.default_value" }),
                    ]),
                    Col({ col: 6 }, [
                      "required:",
                      View({ tag: "span", $text: "field.required" }),
                    ]),
                  ]),
                ]),

                Col({ ms: "auto" }, [
                  View({ d: "flex", gap: "xs" }, [
                    Button(
                      {
                        size: "sm",
                        color: "error",
                        onClick: 'if(field.new) {fields = fields.filter((x, i) => i !== index)} else {field.removed = true}'
                      },
                      "Remove"
                    ),
                    Button({ size: "sm", color: "primary" }, "Save"),
                  ]),
                ]),
              ]),
            }),
          ]),
        ]),
        Button({ onClick: addField, mt: "xs" }, "Add Field"),
      ]),

      Col({ col: 12 }, [
        ButtonGroup({ ms: "auto", justify: "end" }, [
          Button({ type: "button", href: `/data/${value.slug ?? ""}` }, [
            "Cancel",
          ]),
          Button({ color: "primary", onClick: onSumbit }, [
            Icon({ name: "plus" }),
            submitText,
          ]),
        ]),
      ]),
    ]
  );
}
