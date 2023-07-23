import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormField,
  Input,
  View,
} from "@ulibs/ui";
import { IconPicker } from "../../components/IconPicker.js";
import { PageHeader } from "../../components/PageHeader.js";
import { tables } from "./layout.js";
import { Icon } from "@ulibs/ui";
import { TableEditor } from "./table.view.js";

export function createTablePage(ctx) {
  ctx.addPage("/data/create", {
    load() {
      return {
        title: "Create Table",
      };
    },
    actions: {
      create({ body }) {
        tables = [
          ...tables,
          {
            ...body,
            columns: [
              { key: "id", text: "#" },
              { key: "name", text: "Name" },
              { key: "username", text: "Username" },
              { key: "email", text: "Email" },
            ],
          },
        ];
        console.log(body);
        return {
          reload: true,
        };
      },
    },
    page: (props) => {
      return [
        PageHeader({ title: props.title }),
        TableEditor({ action: "create" }),
      ];
    },
  });
}
