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
  
  export function editTablePage(ctx) {
    ctx.addPage("/data/:table/edit", {
      async load({params, locals}) {
        const table = locals.table;
        return {
            title: "Edit Table",
            table
        };
      },
      actions: {
        async update({ body }) {
            console.log(body)
            const id = body.id
          const newTable = {
            name: body.name,
            icon: body.icon,
            slug: body.slug          
          }
  
          const result = await ctx.Tables.update(id, newTable)
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
          TableEditor({ value: props.table, action: "update", submitText: 'Update' }),
        ];
      },
    });
  }
  