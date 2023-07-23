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
      async create({ body }) {
        const newTable = {
          name: body.name,
          icon: body.icon,
          slug: body.slug          
        }

        const result = await ctx.Tables.insert(newTable)
        //   ...tables,
      //   {
        //     ...body,
        //     columns: [
        //       { key: "id", text: "#" },
        //       { key: "name", text: "Name" },
        //       { key: "username", text: "Username" },
        //       { key: "email", text: "Email" },
        //     ],
        //   },
        // ];
        
        return {
          status: 201,
          body: {
            message: {
              type: 'success',
              content: 'Table Successfully created!'
            },
            result,
          }
        }
      
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
