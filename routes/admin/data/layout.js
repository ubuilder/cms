import { Button, Icon, Tooltip, View } from "@ulibs/ui";
import { SidebarItem } from "../../../components/sidebar.js";
import { WithSidebar } from "../../../components/WithSidebar.js";

export async function load({ ctx, locals }) {
  // move to better place
  ctx.Tables = ctx.table("tables");

  locals.tables = (
    await ctx.Tables.query({perPage: 100})
  ).data;

  locals.title = "Table & Data";

  return locals;
}

export default (props, $slots) => {
  const mode = "default";
  const sidebarItems = [
    Button(
      {
        dSm: "none",
        d: "flex",
        color: "primary",
        justify: "center",
        icon: "plus",
        href: "/admin/data/make",
        style: "position: sticky; top: 0",
      },
      [Icon({ name: "plus" }), Tooltip({ placement: "right" }, "Create Table")]
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
          Button({ color: "primary", href: "/admin/data/make", w: 100 }, [
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
        href: "/admin/data/" + table.slug + "/edit",
        title: table.name,
        icon: table.icon,
      })
    ),
  ];

  return WithSidebar({ mode, sidebarItems }, $slots);
};
