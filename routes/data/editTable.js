import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    Col,
    Form,
    FormField,
    Input,
    Modal,
    View,
  } from "@ulibs/ui";
  import { IconPicker } from "../../components/IconPicker.js";
  import { PageHeader } from "../../components/PageHeader.js";
  import { tables } from "./layout.js";
  import { Icon } from "@ulibs/ui";
  import { TableEditor } from "./table.view.js";
import { updateTable } from "./actions.js";
  
  export function editTablePage(ctx) {
    ctx.addPage("/admin/data/:table/edit", {
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
        async remove({body}) {
          const id = body.id

          // remove table

          return {
            status: 201,
            body: {
              message: {
                type: 'success',
                content: 'Table Successfully created!'
              },
              result: id,
            }
          }          
        }
      },
      page: (props) => {
        return [
          PageHeader({ title: props.title }),
          TableEditor({ value: {table_name: props.table.name, fields: props.table.fields, slug: props.table.slug, icon: props.table.icon, id: props.table.id}, action: "update", submitText: 'Update' }),

          Button({color: 'error', onClick: `$modal.open('remove-table')`}, "Remove Table"),
          Modal({name: 'remove-table'}, [
            Card({title: 'Remove Table?'}, [
              CardBody(`Are you sure to remove ${props.table.name} table with all of it's data?`),
              CardFooter([
                ButtonGroup({ms: 'auto'}, [
                  Button({onClick: `$modal.close()`}, "Cancel"),
                  Button({onClick: `$post('?remove', {id: ${props.table.id}}).then(res => $modal.close())`, color: 'error'}, "Remove"),
                ])

              ])
            ])
          ])
        ];
      },
    });
  }
  