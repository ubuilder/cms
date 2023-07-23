import { View } from "@ulibs/ui";
import { dataLayout } from "./layout.js";
import { tableListPage } from "./table.js";
import { createTablePage } from "./create.js";

async function initializeDataTables(ctx) {
  // await ctx.createTable('tables', {
  //   name: 'string',
  //   slug: 'string|required|unique',
  //   icon: 'string|default=database',
  // })

  // await ctx.createTable('fields', {
  //   key: 'string|required',
  //   label: 'string',
  //   description: 'string',
  //   options: 'string'
  // })

  ctx.Tables = ctx.getModel('tables')
  ctx.Fields = ctx.getModel('fields') 
}

export default async function data(ctx) {

  await initializeDataTables(ctx)
  
  dataLayout(ctx);
  tableListPage(ctx);
  createTablePage(ctx);
  
  ctx.addPage('/data/test-data', {
    async load() {
      return {
        tables: await ctx.Tables.query({}),
        fields: await ctx.Fields.query({})
      }
    }
  })  

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
