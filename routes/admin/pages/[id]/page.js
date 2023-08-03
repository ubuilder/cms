import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  Row,
  Textarea,
  View,
} from "@ulibs/ui";
import { SidebarItem } from "../../../../components/sidebar.js";
import { WithSidebar } from "../../../../components/WithSidebar.js";
import { Page } from "../../../../components/Page.js";
import {
  closeModal,
  navigate,
  openModal,
  reload,
  runAction,
} from "../../../../utils/ui.js";

export async function load({ ctx, params, query }) {
  const page = await ctx
    .table("pages")
    .get({ where: { id: params.id } });


  const pages = await ctx.table('pages').query({where: {slug: page.slug}})
    

  return {
    page,
    pages: pages.data,
  };
}

export async function save({ ctx, params, body }) {
  const page = await ctx
    .table("pages")
    .get({ where: { id: params.id } });

  delete page['id']

    
  console.log({ page });
  const newPage = await ctx.table("pages").insert({
    slug: page.slug,
    title: body.title ?? page.title,
    layout: body.layout ?? page.layout,
    template: body.content ?? page.template,
    head: body.head ?? page.head,
    published: false,
  });

  return {
    body: {
      page: `/admin/pages/${newPage.id}`,
    },
  };
}
export async function publish({ ctx, params, body }) {

  const page = await ctx
    .table("pages")
    .get({ where: { id: params.id } });

  const pages = await ctx.table('pages').query({where: {slug: page.slug}})

  for (let page of pages.data) {
    await ctx.table("pages").update(page.id, { published: false });
  }

  await ctx.table("pages").update(page.id, { published: true });

  return {
    body: {
      success: true,
    },
  };
}

export default ({ page, pages = [] }) => {
  if (!page)
    return [
      View(
        {
          p: "xl",
          d: "flex",
          gap: "md",
          align: "center",
          justify: "center",
          flexDirection: "column",
        },
        ["Page Not Found", Button({ href: "/admin/pages" }, "Go Back")]
      ),
    ];

  const sidebarItems = pages.map((page) =>
    SidebarItem({
      mode: "default",
      href: `/admin/pages/${page.id}`,
      title: View({ d: "flex", gap: "xs", align: "center" }, [
        page.title,
        page.published ? Badge({ color: "success" }, "Published") : "",
      ]),
      icon: "file",
    })
  );

  const script = `let data = { initial_content: \`${(
    page.template ?? ""
  ).replace(/script/g, "\\script")}\`, content: \`${(
    page.template ?? ""
  ).replace(/script/g, "\\script")}\`, head: \`${
    (page.head ?? "").replace(/script/g, "\\script") ?? ""
  }\`, initial_head: \`${
    (page.head ?? "").replace(/script/g, "\\script") ?? ""
  }\`, published: ${page.published}, title: \`${
    page.title
  }\`, initial_title: \`${page.title}\` }`;

  const isDirty = () =>
    `title !== initial_title || content !== initial_content || head !== initial_head`;
  const notDirty = () =>
    `title === initial_title && content === initial_content && head === initial_head`;

  function PreviewModal() {
    return Modal({ name: "preview-modal", size: "lg" }, [
      Card({}, [
        CardHeader([
          CardTitle(page.title),
          Button({ onClick: closeModal() }, "Close"),
        ]),
        CardBody({ style: "max-height: 80%; overflow: auto", p: 0 }, [
          View({
            tag: "iframe",
            src: `/preview/${page.id}`,
            border: true,
            borderColor: "base-400",
            w: 100,
            h: 100,
          }),
        ]),
      ]),
    ]);
  }

  return WithSidebar(
    { mode: "default", sidebarItems },
    Page(
      {
        script,
        $data: "data",
        title: "Edit Page: " + page.title,
        actions: [
          Button({ href: "/admin/pages" }, "Cancel"),

          Button(
            {
              $if: notDirty(),
              color: "success",
              onClick: openModal("preview-modal"),
              //   href: "/preview/" + page.id,
            },
            "Preview"
          ),

          Button(
            {
              $if: isDirty(),
              color: "primary",
              onClick: runAction(
                "save",
                "{content, head, title}",
                navigate("res.page")
              ),
            },
            "Save Draft"
          ),
          Button(
            {
              color: "primary",
              $disabled: `published`,
              onClick: runAction(
                "publish",
                '{}',
                reload()
              ),
            },
            "Publish"
          ),
        ],
      },
      [
        Row([
          Input({
            label: "Title",
            description: "Title of page",
            name: "title",
          }),
          Textarea({
            label: "Head Content",
            description: "You can enter script or css files here",
            rows: 10,
            name: "head",
          }),
          Textarea({
            label: "Page Content",
            description: "You can use handlebars syntax here",
            rows: 20,
            name: "content",
          }),
        ]),

        PreviewModal(),
      ]
    )
  );
};