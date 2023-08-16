import { Button, ButtonGroup, Card, CardBody, CardFooter, Modal } from "@ulibs/ui";
import { TableEditor } from "../../TableEditor.js";
import { Page } from "../../../../../components/Page.js";
import { updateTable, removeTable } from "../../make/actions.js";

export async function load({ ctx, params }) {
  // const table = ctx.Tables.get({where: {id: params.name}});
  console.log(params)
  // console.log({ locals, table });
  return {
    title: "Edit Table",
    table,
  };
}

export async function update({ ctx, body }) {
  await updateTable(ctx, body);

  return {
    status: 204,
    body: {
      message: {
        type: "success",
        content: "Table Successfully updated!",
      },
      result: true,
    },
  };
}

export async function remove({ctx, body }) {
  await removeTable(ctx, body);
  return {
    status: 202,
    body: {
      message: {
        type: "success",
        content: "Table Successfully deleted!",
      },
      result: true,
    },
  };
}

export default (props) => {
    if(!props.table) return 'Table not found (TODO: Go Back)'
    
  return Page({title: props.title}, [
    TableEditor({
      value: {
        table_name: props.table.name,
        fields: props.table.fields,
        slug: props.table.slug,
        icon: props.table.icon,
        id: props.table.id,
      },
      action: "update",
      submitText: "Update",
    }),

    Button(
      { color: "error", onClick: `$modal.open('remove-table')` },
      "Remove Table"
    ),
    Modal({ name: "remove-table" }, [
      Card({ title: "Remove Table?" }, [
        CardBody(
          `Are you sure to remove ${props.table.name} table with all of it's data?`
        ),
        CardFooter([
          ButtonGroup({ ms: "auto" }, [
            Button({ onClick: `$modal.close()` }, "Cancel"),
            Button(
              {
                // onClick: `$post('?remove', {id: '${props.table.id}'}).then(res => {$modal.close()}).then(a => location.href = 'http://localhost:3043/admin/data')`,
                onClick: `console.log('')`,
                color: "error",
              },
              "Remove"
            ),
          ]),
        ]),
      ]),
    ]),
  ]);
};
