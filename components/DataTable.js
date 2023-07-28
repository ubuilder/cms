import {
  TableCell,
  Icon,
  View,
  Table,
  TableHead,
  TableBody,
  TableRow,
} from "@ulibs/ui";

export function DataTable($props = {}) {
  const { columns = [], rows = [] } = $props;

  return Table({ "u-data-table": true }, [
    TableHead([
      columns.map((column) =>
        TableCell(
          { onClick: `$table.sort('${column.key}')` },
          View({ d: "flex", align: "center", gap: "xs" }, [
            column.text,
            Icon(
              {
                size: "sm",
                style: "cursor: pointer; color: var(--color-base-700)",
                name: "arrows-sort"
              },
              
            ),
            // Icon({ style: 'cursor: pointer;', name: 'sort-ascending'}),
            // Icon({ style: 'cursor: pointer;', name: 'sort-descending'}),

            //   "SORT",
          ])
        )
      ),
    ]),
    TableBody([
      rows.map((row) =>
        TableRow([
          columns.map((column) =>
            TableCell([column.render ? column.render(row) : row[column.key]])
          ),
        ])
      ),
    ]),
  ]);
}
