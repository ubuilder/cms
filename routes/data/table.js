import { Button, Icon, Card, Tooltip, View } from "@ulibs/ui";
import { PageHeader } from "../../components/PageHeader.js";
import { DataTable } from "../../components/DataTable.js";

export function tableListPage(ctx) {
  ctx.addPage("/data/:table", {
    load(props) {
      const table = props.tables.find(
        (table) => table.slug === props.params.table
      );
    //   if (!table) {
    //     return {
    //       status: 303,
    //       headers: {
    //         location: "/data",
    //       },
    //     };
    //   }
    if(!table) return {table: {}}
      return {
        title: table.name,
        table: table ?? {},
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      };
    },
    page: ({ table, rows, params, title }) => {
      if (!table) return "";
      return [
        View({ pt: "md" }, [
          PageHeader({ title }, [
            Button({ href: `/data/${table.slug}/edit` }, [
              Icon("settings"),
              Tooltip({ placement: "left" }, "Table Settings"),
            ]),
            Button({ color: "primary" }, [Icon("plus"), "Insert"]),
          ]),
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
