import {
  Button,
  Icon,
  Card,
  Tooltip,
  View,
  Modal,
  ModalBody,
  Row,
  Input,
  Col,
  CardFooter,
  CardBody,
} from "@ulibs/ui";
import { PageHeader } from "../../components/PageHeader.js";
import { DataTable } from "../../components/DataTable.js";

export function tableListPage(ctx) {
  ctx.addPage("/data/:table", {
    async load(props, { redirect }) {
      const table = props.locals.tables.find(
        (x) => x.slug === props.params.table
      );
      if (!table) redirect({ path: "/data" });

      const rows = await ctx
        .getModel(table.slug)
        .query({
          /** use filters */
        })
        .then((res) => res.data);

      return {
        title: table.name,
        fields: table.fields,
        table: table ?? {},
        rows,
      };
    },
    actions: {
      async insert({ body }) {
        console.log("insert data: ", body);

        const [id] = await ctx.getModel(body.table).insert(body.data);

        return {
          status: 200,
          body: {
            message: "Data inserted Successfully!",
            result: id,
          },
        };
      },
    },
    page: ({ table, rows, params, title }) => {
      if (!table) return "";

      const insertData = { data: {}, table: table.slug };
      const onInsert = `$post('?insert', {data, table}).then(res => {$modal.close(); $alert.success(res.message);navigation.reload()})`;
      return [
        PageHeader({ title }, [
          Button({ href: `/data/${table.slug}/edit` }, [
            Icon({ name: "settings" }),
            Tooltip({ placement: "left" }, "Table Settings"),
          ]),
          Button({ color: "primary", onClick: "$modal.open('insert-data')" }, [
            Icon({ name: "plus" }),
            "Insert",
          ]),
        ]),
        Card(
          { border: true, style: "--view-border-color: var(--color-base-400)" },
          [
            DataTable({
              columns: table.fields.map((field) => ({
                text: field.name,
                key: field.slug,
              })),
              rows: rows,
            }),
          ]
        ),
        Modal({ size: "xs", name: "insert-data" }, [
          Card({ $data: insertData }, [
            CardBody([
              Row([
                table.fields.map((field) =>
                  Input({
                    name: `data.` + field.slug,
                    label:
                      field.name +
                      " (" +
                      field.type +
                      ")" +
                      `${field.required ? "*" : ""}`,
                  })
                ),
              ]),
            ]),
            CardFooter({justify: "end"}, [
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
      ];
    },
  });
}
