import { Badge, Button, Container, Divider, Icon, View } from "@ulibs/ui";
import { Sidebar, SidebarItem } from "../../components/sidebar.js";
import { Tooltip } from "@ulibs/ui";
import { MainLayout } from "../../components/MainLayout.js";

export let tables = [
  {
    icon: "user",
    slug: "users",
    name: "Users",
    columns: [
      { key: "id", text: "#" },
      { key: "name", text: "Name" },
      { key: "username", text: "Username" },
      { key: "email", text: "Email" },
    ],
  },
  {
    icon: "file",
    slug: "blogs",
    name: "Blogs",
    columns: [
      { key: "id", text: "Id" },
      { key: "title", text: "Title" },
      { key: "content", text: "Content" },
      {
        key: "status",
        text: "Status",
        render: (item) => Badge({ color: "primary" }, item.status),
      },
    ],
  },
];

export function dataLayout(ctx) {
  ctx.addLayout("/data", {
    async load(props) {
      props.locals.tables = (
        await ctx.Tables.query({
          perPage: 100,
          with: { fields: { table: "fields", field: "table_id", multiple: true } },
        })
      ).data;
      console.log('tables: ', props.locals.tables);

      props.locals.title = "Table & Data";

      return props.locals;
    },
    component(props, $slots) {
      const mode = "default";
      const sidebarItems = [
        Button(
          {
            dSm: "none",
            d: "flex",
            color: "primary",
            justify: "center",
            icon: "plus",
            href: "/data/create",
            style: "position: sticky; top: 0",
          },
          [
            Icon({ name: "plus" }),
            Tooltip({ placement: "right" }, "Create Table"),
          ]
        ),
        View(
          {
            d: "none",
            dSm: "block",

            style:
              "position: sticky; top: 0; background-color: var(--color-base-200)",
          },
          [
            View({ p: "xs" }, [
              Button({ color: "primary", href: "/data/create", w: 100 }, [
                Icon({ name: "plus" }),
                View({ tag: "span" }, "Create table"),
              ]),
            ]),
            View({
              style: "border-bottom: 1px solid var(--color-base-400)",
            }),
          ]
        ),
        ...props.tables.map((table) =>
          SidebarItem({
            mode,
            href: "/data/" + table.slug,
            title: table.name,
            icon: table.icon,
          })
        ),
      ];

      return MainLayout({ mode, sidebarItems }, $slots);
    },
  });
}
