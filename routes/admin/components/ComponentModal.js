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
  Select,
  Textarea,
  View,
} from "@ulibs/ui";
import {createModal} from '../../../components/createModal.js'

const componentPropTypes = [
  { key: "plain_text", text: "Plain Text" },
  { key: "rich_text", text: "Rich Text" },
  { key: "code", text: "Code" },
  { key: "number", text: "Number" },
  { key: "date", text: "Date" },
  { key: "boolean", text: "Boolean" },
];

function Props({ label, description, name, hasArray, buttonText= 'Add Prop', placeholder = 'Enter name of new prop...' }) {
  return FormField({ label, description }, [
    Accordions({ $for: `prop, index in ${name}`, style: "border: none" }, [
      Card({ mb: "xxs" }, [
        Accordion({
          style: "border: none",
          header: [View({ $text: "prop.name" }), Badge("Tags")],
          body: [
            Row([
              Input({ colXs: 6, label: "Name", name: "prop.name" }),
              Select({
                colXs: 6,
                label: "Type",
                name: "prop.type",
                key: "key",
                text: "text",
                items: hasArray ? [...componentPropTypes, {key: 'array', text: 'Array'}] : componentPropTypes,
              }),
              Input({ $if: "prop.type !== 'array'", label: "Default Value", name: "prop.default_value" }),

              hasArray && Col({$if: "prop.type === 'array'", col: 12}, [
                Props({label: 'Fields', description: 'Enter fields of the Array', name: `prop.fields`, hasArray: false, buttonText: 'Add Field', placeholder: 'Enter name of new field...'})
              ]) || '',

              Col({ d: "flex", justify: "end", col: 12 }, [
                Button(
                  {
                    onClick: `${name}.splice(index, 1)`,
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
    Row({ mt: "sm", $data: { new_name: "" } }, [
      Input({
        col: true,
        placeholder,
        name: "new_name",
      }),
      Col({ col: 0 }, [
        Button(
          {
            onClick: `${name}.push({name: new_name, type: 'plain_text', ${hasArray ? 'fields: [], ' : ''}default_value: ''}); new_name = ''`,
          },
          [Icon({ name: "plus" }), buttonText]
        ),
      ]),
    ]),
  ]);
}

export function ComponentModal({
  onAdd = "",
  onEdit = "",
  name = "add-component",
  mode = "add",
  value = { props: [], slot_id: '', name: "", new_name: "" },
}) {
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
        hasArray: true,
      }),
      value.slot_id && FormField({label: 'Edit'},[
        Button({ onClick: `openEditComponentModal(${JSON.stringify(value)})`, color: 'primary'}, "Edit Component")
      ]) ||  '',

    ],
  });
}
