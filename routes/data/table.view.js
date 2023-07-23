import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormField,
  Icon,
  Input,
  Row,
} from "@ulibs/ui";
import { IconPicker } from "../../components/IconPicker.js";

export function TableEditor({
  submitText = 'Create',
  value = {},
  successMessage = "Table created successfully",
  ...$props
}) {
  console.log(value)
  return Form(
    {
      ...$props,
      method: "FUNCTION",
      action: `$post('?${$props.action}', $value)\
        .then(async res => {\
          await $routing.goto('/data/' +$value.slug); \
            $alert.success('${successMessage}')\
          })`,
    },
    [
      FormField(
        { label: "Icon:", col: 0 },
        IconPicker({ value: value.icon ?? 'database', name: "icon" })
      ),
      value.id && Input({d: 'none', name: 'id', type: 'hidden', value: value.id}) || [],
      Input({
        col: true,
        name: "name",
        placeholder: "Enter Table name (Posts, Users, ...)",
        label: "Name:",
        value: value.name,
      }),
      Input({
        col: 12,
        name: "slug",
        placeholder: "Enter URL Slug (posts, users, ...)",
        label: "Slug:",
        value: value.slug,
      }),

      FormField({ label: "Columns" }, [
        Row([Col("col 1"), Col("col 2"), Col("col 3")]),
      ]),

      Col({ col: 12 }, [
        ButtonGroup({ ms: "auto", justify: "end" }, [
          Button({ type: "button", href: `/data/${value.slug ?? ''}` }, ["Cancel"]),
          Button({ color: "primary" }, [Icon("plus"), submitText]),
        ]),
      ]),
    ]
  );
}
