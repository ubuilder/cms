import { Button, Icon, Row } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { TableAddModal } from "./TableModals.js";
import { TableItem } from "./TableItem.js";

export * from "./actions.js";

export async function load({ ctx }) {
  const tables = await ctx.table("tables").query();
  return {
    tables: tables.data,
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
