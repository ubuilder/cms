import { Button, ButtonGroup, Card, CardBody, CardFooter, Modal } from "@ulibs/ui";
import { TableEditor } from "../../TableEditor.js";
import { PageHeader } from "../../../../../components/PageHeader.js";
import { Page } from "../../../../../components/Page.js";

export async function load({ ctx, params, locals }) {
  const table = locals.table;
  console.log({ locals, table });
  return {
    title: "Edit Table",
    table,
  };
}

export async function update({ ctx, body }) {
  const result = await updateTable(ctx, body);

  return {
    status: 201,
    body: {
      message: {
        type: "success",
        content: "Table Successfully created!",
      },
      result,
    },
  };
}
export async function remove({ ctx, body }) {
  const id = body.id;

  // remove table

  return {
    status: 201,
    body: {
      message: {
        type: "success",
        content: "Table Successfully created!",
      },
      result: id,
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
                onClick: `$post('?remove', {id: ${props.table.id}}).then(res => $modal.close())`,
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
