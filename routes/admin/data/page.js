import { Page } from "../../../components/Page.js";
import { Button, Row, Icon, View, Col } from "@ulibs/ui";

export async function load({ ctx, locals }) {
  ctx.Data = await ctx.table("data");

  locals.data = (await ctx.Data.query({ perPage: 100 })).data;

  return locals;
}

export default (props) =>
  Page({ title: "Data list" }, [
    Row([
      Col(
        { col: "sm" },
        Button({ color: "primary", href: "/admin/data/make", w: 100 }, [
          Icon({ name: "plus" }),
          View({ tag: "span" }, "Create Data"),
        ])
      ),
    ]),
    ...props.data.map((d) =>
      Row({mt: 'md', borderColor: 'base-200', borderSize: 'sm'},[
        Col({col: 'md'},View(d.name)),
        Col(
          { col: "sm" },
          Button({ color: "success", href: "/admin/data/make", w: 100 }, [
            Icon({ name: "pen" }),
            View({ tag: "span" }, "Edit"),
          ])
        ),
        Col(
          { col: "sm" },
          Button({ color: "error", href: "/admin/data/make", w: 100 }, [
            Icon({ name: "mistake" }),
            View({ tag: "span" }, "Delete"),
          ])
        ),
      ])
    ),
  ]);
