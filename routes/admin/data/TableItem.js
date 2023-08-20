import { Card, CardBody, Col, Icon, View } from "@ulibs/ui";
import { TableEditModal, TableRemoveModal } from "./TableModals.js";

export function TableItem(table) {
  return Col({ col: 12, colXs: 6, colSm: 4 }, [
    View(
      {
        tag: "a",
        textColor: "base-800",
        style: "text-decoration: none",
        href: "/admin/data/" + table.slug,
      },
      [
        Card([
          CardBody({ py: 0, pe: 0 }, [
            View({ d: "flex", gap: "xs", align: "center" }, [
              Icon({ size: "lg", name: table.icon }),
              View({ tag: "h3" }, table.name),
              Icon({
                ms: "auto",
                p: "md",
                onClick: `$event.preventDefault(); $event.stopPropagation(); $modal.open("table-edit-${table.id}")`,
                name: "settings",
              }),
            ]),
          ]),
        ]),
      ]
    ),
    TableEditModal(table),
    TableRemoveModal(table),
  ]);
}
