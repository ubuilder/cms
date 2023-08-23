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
import { IconPicker } from "../../../components/IconPicker.js";

export function TableEditor({
  submitText = "Create",
  successMessage = "Table created successfully",
  ...$props
}) {
  const addField =
    "fields.push({\
        name: new_name,\
        type: 'plain_text',\
        hint: '',\
        default_value: '',\
        new: true,\
        removed: false,\
        required: false,\
        default_active: false\
      }); new_name = ''";

  const onSumbit = `\
    $post('?${$props.action}', {\
      id, name: table_name, icon, fields\
    })\
    .then(async res => {\
      window.location.href = '/admin/data/' +$data.slug; \
      })\
  `;

  // $alert.success('${successMessage}')\

  // return Row(
  //   {
  //     ...$props,
  //     $data: value,
  //   },
  return [
    FormField({ label: "Icon:", col: 0 }, IconPicker({ name: "icon" })),

    Input({ d: "none", name: "id", type: "hidden" }),

    Input({
      col: true,
      name: "table_name",
      placeholder: "Enter Table name (Posts, Users, ...)",
      label: "Name:",
    }),

    FormField({ label: "Fields", $data: { new_name: "" } }, [
      Accordions({ $if: "fields.length > 0", style: "border: none" }, [
        Card({ mt: "xxs", $for: "(field, index) in fields" }, [
          Accordion({
            open: true,
            style: "border: none",
            header: [
              View({ d: "flex", align: "center", gap: "xs" }, [
                View({ tag: "span", $text: "field.name" }),
                View(
                  {
                    onClick: "$event.stopPropagation()",
                    d: "flex",
                    align: "center",
                    gap: "xs",
                  },
                  [
                    Badge(
                      {
                        tabindex: "0",
                        onClick: "field.required = false",
                        color: "error",
                        $show: `field.required`,
                      },
                      "Required"
                    ),
                    Badge(
                      {
                        tabindex: "0",
                        onClick: "field.required = true",
                        color: "info",
                        $show: `!field.required`,
                      },
                      "Optional"
                    ),
                  ]
                ),
              ]),
              View(
                {
                  onClick: "$event.stopPropagation();",
                },
                View(
                  { tabindex: "0", onClick: "fields.splice(index, 1)" },
                  Icon({ name: "trash" })
                )
              ),
            ],
            body: Row([
              Input({
                colSm: 6,
                label: "Name",
                name: "field.name",
              }),
              Select({
                name: "field.type",
                key: "key",
                text: "text",
                colSm: 6,
                label: "Type",
                items: [
                  { key: "plain_text", text: "Plain Text" },
                  { key: "rich_text", text: "Rich Text" },
                  { key: "number", text: "Number" },
                  { key: "file", text: "File" },
                  { key: "date_time", text: "Date & Time" },
                  { key: "relation", text: "Relation" },
                  { key: "switch", text: "Switch" },
                  { key: "select", text: "Select" },
                ],
              }),
              Input({
                name: "field.select",
                $show: `field.type == 'select'`,
                col: 12,
                label: "Select Values",
                placeholder: "seperate with comma i.e: active,inactive"
              }),
              Input({ col: 12, label: "Hint" }),
              Switch({
                $if: "false",
                colSm: 6,
                name: "field.required",
                label: "Required?",
              }),
              // FormField(
              //   {
              //     colSm: 6,
              //     label: View(
              //       { d: "flex", align: "center", justify: "between" },
              //       [
              //         "Default Value",
              //         Switch({
              //           name: "field.default_active",
              //           col: 0,
              //           d: "flex",
              //           mb: 0,
              //           p: 0,
              //           justify: "end",
              //         }),
              //       ]
              //     ),
              //   },
              //   Row([
              //     Input({
              //       $disabled: `!field.default_active`,
              //       col: 12,
              //       name: "field.default_value",
              //     }),
              //   ])
              // ),

              FormField({ $if: "false", label: "Summary" }, [
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

              Col({ $if: "false", ms: "auto" }, [
                View({ d: "flex", gap: "xs" }, [
                  Button(
                    {
                      size: "sm",
                      color: "error",
                      onClick: "fields = fields.splice(index, 1)",
                    },
                    "Remove"
                  ),
                ]),
              ]),
            ]),
          }),
        ]),
      ]),
      Row({ justify: "end", mt: "xs" }, [
        Input({
          name: "new_name",
          placeholder: "name of new field (name, username, ...)",
          col: true,
        }),
        Col({}, [Button({ onClick: addField }, "Add Field")]),
      ]),
    ]),

    // Col({ col: 12 }, [
    //   ButtonGroup({ ms: "auto", justify: "end" }, [
    //     Button({ type: "button", href: `/data/${value.slug ?? ""}` }, [
    //       "Cancel",
    //     ]),
    //     Button({ color: "primary", onClick: onSumbit }, [
    //       Icon({ name: "plus" }),
    //       submitText,
    //     ]),
    //   ]),
    // ]),
  ];
  // );
}
