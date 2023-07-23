import { Button, Icon, Card, Tooltip, View } from "@ulibs/ui";
import { PageHeader } from "../../components/PageHeader.js";
import { DataTable } from "../../components/DataTable.js";

export function tableListPage(ctx) {
  ctx.addPage("/data/:table", {
    load(props, { redirect }) {
      console.log(props.locals.tables.find(x => x.slug === 'iojij'))
      const table = props.locals.tables.find(
        (x) => x.slug === props.params.table
      );
      if (!table) redirect({ path: "/data" });

          
      return {
        title: table.name,
        table: table ?? {},
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      };
    },
    page: ({ table, rows, params, title }) => {
      if (!table) return "";
      return [
        PageHeader({ title }, [
          Button({ href: `/data/${table.slug}/edit` }, [
            Icon("settings"),
            Tooltip({ placement: "left" }, "Table Settings"),
          ]),
          Button({ color: "primary" }, [Icon("plus"), "Insert"]),
        ]),
        Card(
          { border: true, style: "--view-border-color: var(--color-base-400)" },
          [
            DataTable({
              columns: table.columns,
              rows: rows,
            }),
          ]
        ),
      ];
    },
  });
}
