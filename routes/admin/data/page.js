import { Button, Icon, Row } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { createTable, removeTable, updateTable } from "./make/actions.js";
import { TableAddModal } from "./TableModals.js";
import { TableItem } from "./TableItem.js";

export async function load({ ctx }) {
  const tables = await ctx.table("tables").query();
  return {
    tables: tables.data,
  };
}

export async function create_table({ ctx, body }) {
  await createTable(ctx, body);

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
}

export async function update_table({ ctx, body }) {
  await updateTable(ctx, body);

  return {
    status: 200,
    body: {
      message: {
        type: "success",
        content: "Table Successfully updated!",
      },
      result: true,
    },
  };
}

export async function remove_table({ctx, body }) {
  await removeTable(ctx, body);
  return {
    status: 200,
    body: {
      message: {
        type: "success",
        content: "Table Successfully deleted!",
      },
      result: true,
    },
  };
}


export default ({ tables }) =>
  Page(
    {
      title: "Tables",
      actions: [
        Button(
          { onClick: "$modal.open('table-add-modal')", color: "primary" },
          [Icon({ name: "plus" }), "Create Table"]
        ),
      ],
    },
    [Row([tables.map((table) => TableItem(table))]), TableAddModal()]
  );
