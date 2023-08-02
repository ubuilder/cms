import {
  Accordion,
  Accordions,
  Button,
  ButtonGroup,
  Card,
  Fieldset,
  CardBody,
  CardFooter,
  TextEditor,
  FormField,
  Icon,
  Input,
  Modal,
  Select,
  Badge,
  View,
  Col,
  Row,
  Textarea,
} from "@ulibs/ui";
import { PageHeader } from "../../components/PageHeader.js";
import { MainLayout } from "../../components/MainLayout.js";
import { slugify } from "../data/actions.js";
import hbs from "handlebars";
import { SidebarItem } from "../../components/sidebar.js";

export default function pages(ctx) {
  //
  // manage pages and page editor

  const components = {
    button: {
      name: "Button",
      props: [
        { name: "text", type: "string" },
        { name: "icon", type: "string" },
      ],
      template: `<button><span u-icon name="{icon}" />{text}</button>`,
    },
    text: {
      name: "HTML Text",
      props: [{ name: "content", type: "editor" }],
      template: `{content}`,
    },
  };

  ctx.addLayout("/admin/pages", {
    component(props, slots) {
      return MainLayout({ mode: false }, slots);
      // return ['<div><a href="/pages/create">Create New Page</a> | <a href="/pages/1">View Page 1</a> | <a href="/pages/1/edit">Edit Page 1</a>  </div>', slots].join('')
    },
  });

  const openAddPageModal = "$modal.open('add-page')";
  const openAddComponentModal = "$modal.open('add-component')";

  function ComponentModal({
    onAdd = "",
    onEdit = "",
    name = "add-component",
    mode = "add",
    value = { props: [], name: "", template: "", new_name: "" },
  }) {
    function Props({ label, description, name }) {
      return FormField({ label, description }, [
        Accordions({ $for: `prop, index in ${name}`, style: "border: none" }, [
          Card({ mb: "xxs" }, [
            Accordion({
              style: "border: none",
              header: [View({ $text: "prop.name" }), Badge("Tags")],
              body: [
                Row([
                  Input({ colXs: 6, label: "Name", name: "prop.name" }),
                  Input({ colXs: 6, label: "Type", name: "prop.type" }),
                  Input({ label: "Default Value", name: "prop.default_value" }),

                  Col({ d: "flex", justify: "end", col: 12 }, [
                    Button(
                      {
                        onClick: `${name}.splice(index, 1)`,
                        size: "sm",
                        color: "error",
                      },
                      "Remove"
                    ),
                  ]),
                ]),
              ],
            }),
          ]),
        ]),
        Row({ mt: "sm" }, [
          Input({
            col: true,
            placeholder: "Enter name of new prop...",
            name: "new_name",
          }),
          Col({ col: 0 }, [
            Button(
              {
                onClick: `${name}.push({name: new_name, type: 'string', default_value: ''}); new_name = ''`,
              },
              [Icon({ name: "plus" }), "Add Prop"]
            ),
          ]),
        ]),
      ]);
    }

    return Modal({ name, size: "xs" }, [
      Card(
        {
          title: mode === "add" ? "Add Component" : "Edit Component",
          $data: value,
        },
        [
          CardBody({ style: "overflow: auto; max-height: 80%" }, [
            Row([
              Input({
                label: "Name",
                name: "name",
                description: "Name of the component",
              }),
              Props({
                name: "props",
                label: "Props",
                description:
                  "any prop that you add, will be accessible in template",
              }),
              Textarea({
                name: "template",
                label: "Template",
                description: "use { and } to access to props",
                placeholder: "Hello {name}!",
              }),
            ]),
          ]),
          CardFooter([
            ButtonGroup({ ms: "auto" }, [
              Button({ onClick: "$modal.close()" }, "Cancel"),

              Button(
                {
                  onClick:
                    (mode === "add" ? onAdd : onEdit) + ";$modal.close()",
                  color: "primary",
                },
                mode === "add"
                  ? [Icon({ name: "plus" }), "Add"]
                  : [Icon({ name: "pencil" }), "Update"]
              ),
            ]),
          ]),
        ]
      ),
    ]);
  }

  function PageModal({
    onAdd = "",
    onEdit = "",
    mode = "add",
    value = { title: "", slug: "", layout: "" },
  }) {
    return Modal({ name: "add-page", size: "xs" }, [
      Card({ $data: value, title: mode === "add" ? "Add Page" : "Edit Page" }, [
        CardBody([
          Input({
            label: "Title",
            name: "title",
            placeholder: "Enter title of page",
          }),
          Input({
            label: "Slug",
            name: "slug",
            placeholder: "Enter url part of page /about-us, /blogs/{slug}, ...",
          }),
          Select({
            label: "Layout",
            items: ["empty", "layout-1", "layout-2"],
            name: "layout",
            placeholder: "Choose a Layout",
          }),
        ]),
        CardFooter([
          ButtonGroup({ ms: "auto" }, [
            Button({ onClick: "$modal.close()" }, "Cancel"),

            Button(
              {
                onClick: (mode === "add" ? onAdd : onEdit) + ";$modal.close()",
                color: "primary",
              },
              mode === "add"
                ? [Icon({ name: "plus" }), "Add"]
                : [Icon({ name: "pencil" }), "Update"]
            ),
          ]),
        ]),
      ]),
    ]);
  }

  ctx.addPage("/admin/pages", {
    async load() {
      return {
        pages: await ctx
          .getModel("pages")
          .query({ perPage: 100 })
          .then((res) => res.data),
      };
    },
    actions: {
      async add({ body }) {
        const page = {
          title: body.title,
          slug: body.slug,
          layout: body.layout,
          template: body.template,
          published: false,
          version: 1,
        };
        await ctx.getModel("pages").insert(page);

        return {
          body: {
            success: true,
          },
        };
      },
    },
    page: ({ pages }) => {
      function PageItem({ title = "", slug = "", layout = "", version = 1 } = {}) {
        return View({}, [
          View({ tag: "h3" }, title),
          Badge({color: 'primary'}, version),
          Button({ mt: "sm", color: "primary", href: "/admin/page/" + slug + '?version=' + version  }, [
            Icon({ name: "external-link" }),
            "Edit",
          ]),
        ]);
      }

      return [
        PageHeader({ title: "Pages" }, [
          Button({ href: "/admin/components" }, "Components"),
          Button({ href: "/admin/layouts" }, "Layouts"),
          Button({ onClick: openAddPageModal, color: "primary" }, [
            Icon({ name: "plus" }),
            "Add Page",
          ]),
        ]),
        View(
          { d: "flex", gap: "sm", flexDirection: "column" },
          pages.map((page) => PageItem(page))
        ),
        PageModal({
          onAdd:
            "$post('?add', {title, slug, layout, head: '', template: ''}).then(res => navigation.reload())",
        }),
      ];
    },
  });

  function PageViewer({ content, head, ...restProps } = {}) {
    const template = hbs.compile(content);

    const html = `<!DOCTYPE html><html><head>${head}</head><body style="background-color: white">${template(
      {}
    )}</body></html>`;

    return View({
      tag: "iframe",
      w: 100,
      style: "height: var(100vh - 250px)",
      border: true,
      borderColor: "base-400",
      srcdoc: html.replace(/"/g, "&quot;"),
      ...restProps,
    });
  }

  ctx.addPage("/preview", {
    async load({ params, query }) {
      const pageId = query.id;
      
      let page = await ctx
        .getModel("pages")
        .get({ where: { id: pageId } });

      return {
        page,
      };
    },
    page({ page }) {
      if (!page) {
        return;
      }

      try {
        const template = hbs.compile(page.template);

        return `<!DOCTYPE html><html><head>${page.head}</head><body>${template(
          {}
        )}</body></html>`;
      } catch (err) {
        return `there is an error in this page, \n\n${err.message}.\n\n <a href="/admin/page/${page.slug}">Edit Page</a>"`;
      }
    },
  });

  ctx.addPage("/admin/page/:slug", {
    async load({ params, query }) {
      const version = query.version;

      console.log("load: ", params);
      const pages = await ctx
        .getModel("pages")
        .query({ where: { slug: params.slug } });

      let page;

      if (version) {
        page = pages.data.find((x) => x.version === +version);
      } else {
        page = pages.data[pages.data.length - 1];
      }

      console.log(pages);
      return {
        page,
        pages: pages.data,
      };
    },
    actions: {
      async save({ params, body }) {
        const pages = await ctx
          .getModel("pages")
          .query({ where: { slug: params.slug} });

        const page = pages.data[pages.data.length - 1]
        const version = (page.version ?? 1) + 1;


        console.log({ page });
        await ctx
          .getModel("pages")
          .insert({
            slug: page.slug,

            title: body.title ?? page.title,
            layout: body.layout ?? page.layout,
            template: body.content ?? page.template,
            head: body.head ?? page.head,
            version,
            published: false,
          });

          return {
            body: {
              page: `/admin/page/${page.slug}?version=${version}`
            }
          }
        },
      async publish({ params, body }) {
        const version = +body.version

        const pages = await ctx
          .getModel("pages")
          .query({ where: { slug: params.slug } });

        
        for (let page of pages.data) {
          await ctx.getModel("pages").update(page.id, { published: false });
        }
        const page = await ctx
          .getModel("pages")
          .get({ where: { slug: params.slug, version } });

        await ctx.getModel("pages").update(page.id, { published: true });

        return {
          body: {
            success: true,
          },
        };
      },
    },
    page: ({ page, pages = [] }) => {
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
          href: `/admin/page/${page.slug}?version=${page.version}`,
          title: View({ d: "flex", gap: "xs", align: "center" }, [
            page.title,
            Badge({ color: "primary" }, page.version),
            page.published ? Badge({color: 'success'}, 'Published') : ''
          ]),
          icon: "file",
        })
      );
      return MainLayout({ mode: "default", sidebarItems }, [
        View(
          {
            script: `let data = { initial_content: \`${
              page.template
            }\`, content: \`${page.template}\`, head: \`${
              (page.head ?? "").replace(/script/g, "\\script") ?? ""
            }\`, initial_head: \`${
              (page.head ?? "").replace(/script/g, "\\script") ?? ""
            }\`, published: ${page.published}, title: \`${page.title}\`, initial_title: \`${page.title}\` }`,
            $data: "data",
          },
          [
            PageHeader({ title: "Edit Page " + page.title }, [
              Button({ href: "/admin/pages" }, "Cancel"),

              Button(
                {
                  $if: "title !== initial_title || content === initial_content && head === initial_head",
                  color: "success",
                  href: "/preview?id=" + page.id,
                },
                "Preview"
              ),

              Button(
                {
                  $if: "title !== initial_title || content !== initial_content || head !== initial_head",
                  color: "primary",
                  onClick:
                    "$post('?save', {content, head, title}).then(res => window.location.href = res.page)",
                },
                "Save Draft"
              ),
              Button(
                {
                  color: "primary",
                  $disabled: `published`,
                  onClick: `$post('?publish', {version: ${page.version}}).then(res => navigation.reload())`,
                },
                "Publish"
              ),
            ]),
            Row([
              Input({
                label: 'Title', description: 'Title of page',
                name: 'title'
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
          ]
        ),
      ]);
    },
  });

  ctx.addLayout("/admin/components", {
    component: (props, slots) => {
      return MainLayout({ mode: false }, slots);
    },
  });

  ctx.addPage("/admin/components", {
    async load() {
      const Components = ctx.getModel("components");

      const result = await Components.query({ perPage: 100 });

      return {
        components: result.data,
      };
    },
    actions: {
      async update({ body }) {
        const component = {
          name: body.name,
          slug: slugify(body.name),
          props: body.props,
          template: body.template,
        };
        const id = body.id;

        await ctx.getModel("components").update(id, component);

        return {
          body: {
            success: true,
          },
        };
      },
      async add({ body }) {
        const component = {
          name: body.name,
          slug: slugify(body.name),
          props: body.props,
          template: body.template,
          version: 1,
        };

        await ctx.getModel("components").insert(component);

        return {
          body: {
            success: true,
          },
        };
      },
    },
    page({ components }) {
      function Component({ id, name, props, template }) {
        return [
          Card(
            {
              onClick: `$modal.open('edit-component-${id}')`,
              border: true,
              p: "sm",
              w: "auto",
              d: "inline-flex",
              align: "center",
              justify: "center",
              borderColor: "base-400",
              borderRadius: "md",
            },
            [View({ tag: "h3" }, name)]
          ),
          ComponentModal({
            mode: "edit",
            onEdit: `$post('?update', {id: '${id}', name, props, template}).then(res => navigation.reload())`,
            name: `edit-component-${id}`,
            value: { name, props, template, new_name: "" },
            size: "xs",
          }),
        ];
      }
      return [
        PageHeader({ title: "Components" }, [
          Button({ href: "/admin/pages" }, [
            Icon({ name: "chevron-left" }),
            "Back",
          ]),
          Button({ color: "primary", onClick: openAddComponentModal }, [
            Icon({ name: "plus" }),
            "Add Component",
          ]),
        ]),
        View({ d: "flex", wrap: true, gap: "sm" }, [
          components.map((component) =>
            Component({
              name: component.name,
              props: component.props,
              template: component.template,
              id: component.id,
            })
          ),
        ]),
        ComponentModal({
          onAdd:
            "$post('?add', {name, props, template}).then(res => navigation.reload())",
        }),
      ];
    },
  });

  ctx.addLayout("/admin/layouts", {
    component: (props, slots) => {
      return MainLayout({ mode: false }, slots);
    },
  });

  ctx.addPage("/admin/layouts", {
    page() {
      return [
        PageHeader({ title: "Layouts" }, [
          Button({ href: "/admin/pages" }, [
            Icon({ name: "chevron-left" }),
            "Back",
          ]),
          Button({ color: "primary" }, [Icon({ name: "plus" }), "Add Layout"]),
        ]),
        "Layout list",
      ];
    },
  });

  ctx.addPage("/admin/pages/create", {
    page: "Create new page",
  });

  ctx.addPage("/admin/pages/:id/edit", {
    page: "Edit page settings",
  });
}
