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
      columns.map(({key, text, render, ...rest}) => 
        TableCell(
          { ...rest, onClick: `$table.sort('${key}')` },
          View({ d: "flex", align: "center", gap: "xs" }, [
            text,
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
          columns.map(({render, key}) =>
            TableCell([render ? render(row) : row[key]])
          ),
        ])
      ),
    ]),
  ]);
}
