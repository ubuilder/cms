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
import { updateTable } from "./actions.js";
  
  export function editTablePage(ctx) {
    ctx.addPage("/data/:table/edit", {
      async load({params, locals}) {
        const table = locals.table;
        console.log({locals, table})
        return {
            title: "Edit Table",
            table
        };
      },
      actions: {
        async update({ body }) {
          const result = await updateTable(ctx, body)
        
          
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
          TableEditor({ value: {table_name: props.table.name, fields: props.table.fields, slug: props.table.slug, icon: props.table.icon, id: props.table.id}, action: "update", submitText: 'Update' }),
        ];
      },
    });
  }
  