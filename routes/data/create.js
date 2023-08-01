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
import { createTable } from "./actions.js";

export function createTablePage(ctx) {
  ctx.addPage("/data/create", {
    load() {
      return {
        title: "Create Table",
      };
    },
    actions: {
      async create({ body }) {
        // const result = await createTable(ctx, body)
    
        return {
          status: 201,
          body: {
            message: {
              type: "success",
              content: "Table Successfully created!",
            },
            result: true,
          },
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
