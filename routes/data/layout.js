import { Badge, Button, Container, Icon, View } from "@ulibs/ui";
import { Sidebar, SidebarItem } from "../../components/sidebar.js";
import { Tooltip } from "@ulibs/ui";

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
    load: () => {
      return {
        title: "Table & Data",
        tables,
      };
    },
    component(props, $slots) {
      const mode = "default";
      return View(
        {
          style: "position: relative",
        },
        [
          Sidebar({ mode, d: "none", dMd: "block" }, ({ mode }) => {
            return [
              ...props.tables.map((table) =>
                SidebarItem({
                  mode,
                  href: "/data/" + table.slug,
                  title: table.name,
                  icon: table.icon,
                })
              ),
              Button(
                {
                  dSm: "none",
                  d: "flex",
                  color: "primary",
                  justify: "center",
                  icon: "plus",
                  href: "/data/create",
                },
                [Icon("plus"), Tooltip({ placement: "right" }, "Create Table")]
              ),
              View(
                {
                  d: "none",
                  dSm: "block",
                  py: "xxs",
                  px: "xs",
                },
                Button({ color: "primary", href: "/data/create", w: 100 }, [
                  Icon("plus"),
                  View({ tag: "span" }, "Create table"),
                ])
              ),
            ];
          }),
          View(
            {
              "u-content": "",
              "u-content-sidebar-mode": mode,
              style: "height: calc(100vh - 64px)",
            },
            Container({ size: "xl", mx: "auto" }, [$slots])
          ),
        ]
      );
    },
  });
}
