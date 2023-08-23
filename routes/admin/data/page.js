import { Button, Icon, Row } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { TableAddModal } from "./TableModals.js";
import { TableItem } from "./TableItem.js";
import { Filter } from "../../../components/filters/Filter.js";

export * from "./actions.js";

export async function load({ ctx, query }) {
  const tables = await ctx.table("tables").query({where: query.filters});
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
      filters: [
        Filter({
          type: 'text',
          text: 'Name',
          key: 'name'
        })
      ],
    },
    [Row([tables.map((table) => TableItem(table))]), TableAddModal()]
  );
