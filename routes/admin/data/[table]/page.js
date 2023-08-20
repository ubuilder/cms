import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Icon,
  Input,
  Modal,
  Row,
  Select,
  TableActions,
  Tooltip,
  View,
} from "@ulibs/ui";
import { PageHeader } from "../../../../components/PageHeader.js";
// import { insertData, removeData, updateData } from "../make/actions.js";
import { DataTable } from "../../../../components/DataTable.js";
import { slugify } from "../../../../utils/slugify.js";
import { Page } from "../../../../components/Page.js";

export * from "./actions.js";

export async function load({ ctx, params }) {
  const table = await ctx.table("tables").get({
    where: {
      slug: params.table,
    },
  });

  if (!table) redirect({ path: "/admin/data" });

  const rows = await ctx
    .table(table.slug)
    .query({
      /** use filters */
    })
    .then((res) => res.data);

  return {
    title: table.name,
    fields: table.fields,
    table,
    rows,
  };
}

function GetFormInputs({ fields, value }) {
  console.log({ value });
  return fields.map((field) => {
    const label = field.name + `${field.required ? " *" : ""}`;
    const name = "data." + field.slug;
    let component = Input;
    const options = {};

    if (field.type === "select") {
      component = Select;
      //   TODO: Read items from fields object
      options.items = ["a", "b", "c"];
    } else if (field.type === "date") {
      // component = Datepicker
      options.type = "date";
    }

    return component({
      label,
      name,
      value: value ? value[name] : "",
      ...options,
    });
  });
}

export default ({ table, rows, params, title }) => {
  const data = { data: {}, table: table.slug };

  table.fields.map((field) => {
    field.slug = slugify(field.name);
    data.data[field.slug] = field.default ?? "";
  });

  const onInsert = `$post('?insert_data', {data}).then(res => {$modal.close(); $alert.success(res.message);navigation.reload()})`;

  function onUpdate(id) {
    return `$post('?update_data', {id: '${id}', data}).then(res => {$modal.close(); $alert.success(res.message);navigation.reload()})`;
  }
  function onRemove(id) {
    return `$post('?remove_data', {id: '${id}'}).then(res => {$modal.close(); $alert.success(res.message);navigation.reload()})`;
  }

  function Title() {
    return View({ d: "flex", gap: "xs", align: "center" }, [
      Icon({ name: table.icon, size: "xl" }),
      View({ tag: "h2" }, title),
    ]);
  }

  return Page(
    {
      title: Title(),
      actions: [
        Button({ href: `/admin/data` }, [
          Icon({name: 'chevron-left'}),
          "Back"
        ]),
        Button({ color: "primary", onClick: "$modal.open('insert-data')" }, [
          Icon({ name: "plus" }),
          "Insert",
        ]),
      ],
    },
    [
      Card({ border: true, borderColor: "base-400" }, [
        DataTable({
          columns: [
            ...table.fields.map((field) => ({
              text: field.name,
              key: field.slug,
            })),
            {
              text: "",
              key: "",
              w: 0,
              render: (item) =>
                TableActions([
                  Button(
                    {
                      onClick: `$modal.open('preview-data-${item.id}')`,
                      size: 'sm',
                    },
                    Icon({ name: "eye" })
                  ),
                  Button(
                    {
                      onClick: `$modal.open('update-data-${item.id}')`,
                      size: 'sm',
                      color: "info",
                    },
                    Icon({ name: "pencil" })
                  ),
                  Button(
                    {
                      onClick: `$modal.open('remove-data-${item.id}')`,
                      size: 'sm',
                      color: "error",
                    },
                    Icon({ name: "trash" })
                  ),
                ]),
            },
          ],
          rows: rows,
        }),
      ]),
      Modal({ size: "xs", name: "insert-data" }, [
        Card({ title: "Insert Item", $data: data }, [
          CardBody([
            Row([
              GetFormInputs({ fields: table.fields }), // filter based on insert/update visibility
            ]),
          ]),

          CardFooter({ justify: "end" }, [
            View({ d: "flex", gap: "xs" }, [
              Button({ onClick: "$modal.close()" }, "Cancel"),
              Button({ onClick: onInsert, color: "primary" }, [
                Icon({ name: "plus" }),
                "Insert",
              ]),
            ]),
          ]),
        ]),
      ]),
      rows.map((row) =>
        Modal({ size: "xs", name: "remove-data-" + row.id }, [
          Card({ title: "Remove Item", $data: data }, [
            CardBody([Row(["Are you sure to remove this Item?"])]),

            CardFooter({ justify: "end" }, [
              View({ d: "flex", gap: "xs" }, [
                Button({ onClick: "$modal.close()" }, "Cancel"),
                Button({ onClick: onRemove(row.id), color: "error" }, [
                  "Remove",
                ]),
              ]),
            ]),
          ]),
        ])
      ),
      rows.map((row) =>
        Modal({ size: "xs", name: "preview-data-" + row.id }, [
          Card({ title: "Preview Item", $data: data }, [

            CardBody([JSON.stringify(row)]),
            
            CardFooter({ justify: "end" }, [
              View({ d: "flex", gap: "xs" }, [
                Button({ onClick: "$modal.close()" }, "Close"),
              ]),
            ]),
          ]),
        ])
      ),
      rows.map((row) =>
        Modal({ size: "xs", name: "update-data-" + row.id }, [
          Card({ title: "Update Item", $data: { data: row } }, [
            CardBody([
              Row([
                GetFormInputs({ fields: table.fields }), // filter based on insert/update visibility
              ]),
            ]),

            CardFooter({ justify: "end" }, [
              View({ d: "flex", gap: "xs" }, [
                Button({ onClick: "$modal.close()" }, "Cancel"),
                Button({ onClick: onUpdate(row.id), color: "primary" }, [
                  "Update",
                ]),
              ]),
            ]),
          ]),
        ])
      ),
    ]
  );
};
