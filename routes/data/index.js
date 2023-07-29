import { View } from "@ulibs/ui";
import { dataLayout } from "./layout.js";
import { tableListPage } from "./table.js";
import { createTablePage } from "./create.js";
import { editTablePage } from "./editTable.js";
import { DataEditor } from "./insertData.js";

async function initializeDataTables(ctx) {
  // await ctx.createTable('tables', {
  //   name: 'string',
  //   slug: 'string|required|unique',
  //   icon: 'string|default=database',
  // })

  // await ctx.createTable('fields', {
  //   table: 'tables',
  //   name: 'string',
  //   slug: 'string|required',
  //   hint: 'string',
  //   required: 'boolean',
  //   default: 'string|default=""',
  //   type: 'string' // enum
  // })

  ctx.Tables = ctx.getModel('tables')
  ctx.Fields = ctx.getModel('fields') 
}

export default async function data(ctx) {

  await initializeDataTables(ctx)
  
  ctx.addLayout('/data/:table', {
    async load({params, locals}) {
      console.log('locals: ',locals)
      const table = await ctx.Tables.query({
        perPage: 100,
        with: { fields: { table: "fields", field: "table_id", multiple: true } },
      }).then(res => res.data[0])

      console.log('load: ', table)

      console.log(locals)
      locals.table = table
    }
  })
  

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

  editTablePage(ctx)

  ctx.addPage("/data/:table/insert", {
    page: () => DataEditor({}),
  });

  ctx.addPage("/data/:table/:row", {
    page: () => View("Edit single data item"),
  });
}
