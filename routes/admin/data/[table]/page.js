import {
  Button,
  Card,
  CardBody,
  CardFooter,
  DatePicker,
  Icon,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  TextEditor,
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
      options.items = field.select.split(",");

    } else if (field.type === "date_time") {
      component = DatePicker
    } else if (field.type === 'switch'){
      component = Switch
    } else if(field.type === 'rich_text'){
      component = TextEditor
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

  //change booleans to string and short long fields
  let modifiedRows = rows.map(obj => {
    let newObj = {};
    for (let prop in obj) {
      newObj[prop] = typeof obj[prop] === 'boolean' ? obj[prop].toString() : obj[prop];
    }
    return newObj;
  });

  table.fields.map((field) => {
    field.slug = slugify(field.name);
    data.data[field.slug] = field.default ?? "";
  });

  const onInsert = `$post('?insert_data', {data}).then(res => {$modal.close(); $alert.success(res.message);$page.reload()})`;

  function onUpdate(id) {
    return `$post('?update_data', {id: '${id}', data}).then(res => {$modal.close(); $alert.success(res.message);$page.reload()})`;
  }
  function onRemove(id) {
    return `$post('?remove_data', {id: '${id}'}).then(res => {$modal.close(); $alert.success(res.message);$page.reload()})`;
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
          rows: modifiedRows,
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
