import { Button, ButtonGroup, Col, Form, FormField, Icon, Input } from "@ulibs/ui";
import { IconPicker } from "../../components/IconPicker.js";
export function TableEditor($props) {

return Form({ ...$props }, [
    FormField(
      { label: "Icon:", col: 0 },
      IconPicker({ value: "database", name: "icon" })
    ),
    Input({
      col: true,
      name: "name",
      placeholder: "Enter Table name (Posts, Users, ...)",
      label: "Name:",
    }),
    Input({
      col: 12,
      name: "slug",
      placeholder: "Enter URL Slug (posts, users, ...)",
      label: "Slug:",
    }),

    Col({ col: 12 }, [
      ButtonGroup({ ms: "auto", justify: "end" }, [
        Button({ type: "button" }, ["Cancel"]),
        Button({ color: "primary" }, [Icon("plus"), "Create"]),
      ]),
    ]),
  ])
}