import { View } from "@ulibs/ui";
import { dataLayout } from "./layout.js";
import { tableListPage } from "./table.js";
import { createTablePage } from "./create.js";

export default function data(ctx) {
  dataLayout(ctx);
  tableListPage(ctx);
  createTablePage(ctx);
  

  ctx.addPage("/data", {
    page: () => View("List of tables!"),
  });

  ctx.addPage("/data/:table/edit", {
    page: () => View("Edit table info and fields"),
  });

  ctx.addPage("/data/:table/insert", {
    page: () => View("insert new item to table"),
  });

  ctx.addPage("/data/:table/:row", {
    page: () => View("Edit single data item"),
  });
}
