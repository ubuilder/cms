import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Modal,
} from "@ulibs/ui";
import { TableEditor } from "./TableEditor.js";
import {createModal} from '../../../components/createModal.js';

export function TableAddModal() {
  return createModal({
    name: "table-add-modal",
    title: "Add Table",
    $data: {
      id: "",
      table_name: "",
      icon: "database",
      fields: [],
    },
    body: TableEditor({}),
    actions: [
      Button({ onClick: "$modal.close()" }, "Cancel"),

      Button(
        {
          onClick:
            '$post("?create_table", {id, name: table_name, icon, fields}).then(res => location.reload())',
          color: "primary",
        },
        "Create"
      ),
    ],
  });
}

export function TableEditModal(table) {
  return createModal({
    name: "table-edit-" + table.id,
    title: "Edit " + table.name + " table",
    $data: {
      id: table.id,
      table_name: table.name,
      icon: table.icon,
      fields: table.fields,
    },
    body: TableEditor({}),
    actions: [
      Button("Cancel"),
      Button(
        {
          color: "error",
          onClick: `$modal.close(); $modal.open('remove-table-${table.id}')`,
        },
        "Remove"
      ),
      Button(
        {
          color: "primary",
          onClick: `$post("?update_table", {id, icon, name: table_name, fields }).then(res => location.reload())`,
        },
        "Save"
      ),
    ],
  });
}

export function TableRemoveModal(table) {
  return Modal({ name: "remove-table-" + table.id }, [
    Card({ title: "Remove Table?" }, [
      CardBody(
        `Are you sure to remove ${table.name} table with all of it's data?`
      ),
      CardFooter([
        ButtonGroup({ ms: "auto" }, [
          Button({ onClick: `$modal.close()` }, "Cancel"),
          Button(
            {
              onClick: `$post('?remove_table', {id: '${table.id}'}).then(res => location.reload())`,
              color: "error",
            },
            "Remove"
          ),
        ]),
      ]),
    ]),
  ]);
}
