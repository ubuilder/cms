import {
  Accordion,
  Accordions,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormField,
  Icon,
  Input,
  Modal,
  Popover,
  Row,
  Tooltip,
  View,
} from "@ulibs/ui";
import { Page } from "../../../../../components/Page.js";
import { createModal } from "../../../../../components/createModal.js";
import hbs from "handlebars";
import {
  closeModal,
  reload,
  openModal,
  runAction,
} from "../../../../../utils/ui.js";

const style = `
  <style>
  .item {
    transition: all 0.2s ease;
    position: relative;
    min-height: var(--size-md);
    border: 1px solid transparent;
  }

  .item:hover {
    border: 1px dashed var(--color-primary-400);
  }
  .item.active {
    padding: var(--size-xxs);
    border: 1px solid var(--color-primary-500);
  }
  
  .placeholder {
    transition: all 0.2s ease;
    background-image: repeating-linear-gradient(45deg, var(--color-base-300), var(--color-base-300) 2px,var(--color-primary-100) 2px,var(--color-primary-100) 4px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--size-md);
    gap: var(--size-xs);
    border: 1px dashed var(--color-primary-200);
    opacity: 1;
  }

  .placeholder-md {
    height: 100%;
    min-height: 100px;
    margin: var(--size-xs);
  }

  .placeholder-sm {
    height: 0;
    position: absolute;
    border-color: transparent;

  }

  .item.active {
    margin-bottom: var(--size-sm);
    margin-top: var(--size-sm);
  }

  .item.active .placeholder-sm {
    height: calc(var(--size-sm));
    border: 1px solid var(--color-primary-200);
    top: 0;
    bottom: 0;
  }

  .item.active .placeholder-sm.placeholder-before {
    bottom: calc(100% + 1px);
    top: auto;
    left: -1px;
    right: -1px;
  }

  .item.active .placeholder-sm.placeholder-after {
    left: -1px;
    right: -1px;
    bottom: auto;
    top: calc(100% + 1px);
  }

  .placeholder-slot {
    margin: var(--size-xs);
  }

  .placeholder.active {
    border: 1px solid var(--color-primary-500);
  }
  
  .component-item {
  
  }
  .component-item.active {
    border: 1px solid var(--color-primary-300);
  }
  
  .component-item.active {
    border: 1px solid var(--color-primary-500);
    background-color: var(--color-base-300);
  }
  </style>
  
  `;

export async function add_component({ ctx, body, params }) {
  const id = params.id;
  const page = await ctx.table("pages").get({ where: { id } });

  const newItem = {
    id: "content_" + Math.random(),
    component_id: body.component_id,
    props: {},
  };

  console.log("add_component", body);

  let content = [];
  for (let item of page.content) {
    if (item.id == body.position) {
      if (body.placement === "before") {
        content.push(newItem);
        content.push(item);
      } else if (body.placement === "after") {
        content.push(item);
        content.push(newItem);
      } else {
        content.push(item);
      }
      // slot
    } else {
      content.push(item);
    }
  }

  if (!body.position && body.placement === "after") {
    console.log("insert at end of page");
    content.push(newItem);
  }

  page.content = content;
  await ctx.table("pages").update(id, page);

  return {
    body: {
      success: true,
    },
  };
}

export async function set_props({ ctx, body, params }) {
  console.log("set props", body);

  const props = body.props;

  const pageId = params.id;
  const itemId = body.id;

  const page = await ctx.table("pages").get({ where: { id: pageId } });

  let content = [];

  for (let item of page.content) {
    if (item.id == itemId) {
      for (let prop of props) {
        item.props[prop.name] = prop.value;
      }
    }
    content.push(item);
  }

  page.content = content;
  await ctx.table("pages").update(pageId, page);

  return {
    body: {
      success: true,
    },
  };
}

export async function remove_component({ ctx, params, body }) {
  const itemId = body.id;
  const pageId = params.id;

  const page = await ctx.table("pages").get({ where: { id: pageId } });

  let content = [];

  for (let item of page.content) {
    if (item.id == itemId) continue;
    content.push(item);
  }

  page.content = content;
  await ctx.table("pages").update(pageId, page);

  return {
    body: {
      success: true,
    },
  };
}

export async function update_title({ ctx, params, body }) {
  const title = body.title;
  const page = await ctx.table("pages").get({ where: { id: params.id } });

  await ctx.table("pages").update(page.id, { title });

  return {
    body: {
      success: true,
    },
  };
}

export async function load({ ctx, params }) {
  const id = params.id;

  const page = await ctx.table("pages").get({ where: { id } });

  const components = await ctx.table("components").query({ perPage: 100 });

  for (let item of page.content) {
    const component = await ctx
      .table("components")
      .get({ where: { id: item.component_id } });

    console.log({ component });
    const itemProps = {};

    for (let propName in item.props) {
      const prop = item.props[propName];

      if (prop.type === "load") {
        const res = await ctx
          .table(prop.table)
          .get({ where: prop.where, select: { [prop.field]: true } });

        itemProps[propName] = res[prop.field];
      } else if (prop.type === "static") {
        itemProps[propName] = prop.value;
      }
    }

    function renderItem() {
      const props = {};

      const template = component.template;

      component.props.map((prop) => {
        props[prop.name] = itemProps[prop.name] ?? prop.default_value;
      });

      props.slot = Placeholder({ id: item.id, placement: "slot" });

      return hbs.compile(template)(props);
    }

    // render hbs
    item.content = renderItem();
    item.component = component;
  }

  return {
    page,
    components: components.data,
  };
}

function Placeholder({ id, size = "md", placement } = {}) {
  return View(
    {
      class: `placeholder placeholder-${size} placeholder-${placement}`,
      onClick: `$event.stopPropagation(); position='${id}'; placement='${placement}'; ${openModal(
        "add-component"
      )}`,
    },
    false
      ? [[Icon({ size: "lg", name: "plus" }), "Click to add Component"]]
      : []
  );
}

function ContextMenu() {
  return View(
    {
      "onClick.outside": "contextmenuOpen = false",
      onClick: "contextmenuOpen = false",
      $style:
        "contextmenuOpen ? ('z-index: 2; position: absolute; display: block; top: ' + y + 'px;' + 'left: ' + x + 'px') : 'display: none'",
    },
    [
      Card([
        CardBody({ p: "xs", d: "flex", flexDirection: "column" }, [
          View(
            {
              onClick: `$modal.open('component-' + id + '-settings')`,
              d: "flex",

              py: "xs",
              px: "sm",
              style: "cursor: pointer",
              gap: "sm",
              align: "center",
              me: "lg",
            },
            [Icon({ name: "settings" }), "Settings"]
          ),
          View(
            {
              onClick: `$modal.open('component-' + id + '-remove')`,
              d: "flex",
              py: "xs",
              px: "sm",
              style: "cursor: pointer",
              gap: "sm",
              align: "center",
              me: "lg",
            },
            [Icon({ name: "x" }), "Remove"]
          ),
          View(
            {
              onClick: ` position=id; placement='before'; ${openModal(
                "add-component"
              )}`,
              d: "flex",
              py: "xs",
              px: "sm",
              style: "cursor: pointer",
              gap: "sm",
              align: "center",
              me: "lg",
            },
            [Icon({ name: "chevron-up" }), "Insert Component Before"]
          ),
          View(
            {
              onClick: ` position= id; placement='after'; ${openModal(
                "add-component"
              )}`,
              d: "flex",
              py: "xs",
              px: "sm",
              style: "cursor: pointer",
              gap: "sm",
              align: "center",
              me: "lg",
            },
            [Icon({ name: "chevron-down" }), "Insert Component After"]
          ),
        ]),
      ]),
    ]
  );
}

function ComponentContent(item) {
  return [
    View(
      {
        class: "item",
        tabindex: 0,
        "onClick.outside": "id = ''",
        onDblclick: `$modal.open('component-${item.id}-settings')`,
        $class: `id === '${item.id}' ? 'active' : ''`,
        onClick: `setTimeout(() => id = '${item.id}')`,
        onContextmenu: `$event.preventDefault(); contextmenuOpen = true; x = $event.clientX; y = $event.clientY; id = '${item.id}'`,
        style: "cursor: default",
      },
      [
        Placeholder({ id: item.id, placement: "before", size: "sm" }),
        item.content,
        Placeholder({ id: item.id, placement: "after", size: "sm" }),
        
        // Popover({ placement: "top-end", trigger: "hover", p: 0, gap: 0 }, [
        //   ButtonGroup({ compact: true, style: "border-radius: 0" }, [
        //     Button(
        //       {
        //         size: "sm",
        //         onClick: `$modal.open('component-${item.id}-settings')`,
        //       },
        //       [Icon({ name: "settings" })]
        //     ),
        //     Button(
        //       {
        //         size: "sm",
        //         color: "error",
        //         onClick: `$modal.open('component-${item.id}-remove')`,
        //       },
        //       Icon({ name: "x" })
        //     ),
        //   ]),
        // ]),
      ]
    ),
  ];
}

function PreviewModal(page) {
  return Modal({ name: "preview-modal", size: "lg" }, [
    Card({}, [
      CardHeader([
        CardTitle(page.title),
        ButtonGroup([
          Button({ href: "/preview/" + page.id, target: "_blank" }, [
            Icon({ name: "external-link" }),
            "Open in new tab",
          ]),
          Button({ onClick: closeModal() }, "Close"),
        ]),
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

function ComponentSettingsModal({
  id,
  component: { props: componentProps, name, template } = {},
  props: instanceProps = {},
}) {
  const props = [];

  for (let prop of componentProps) {
    props.push({
      name: prop.name,
      value: instanceProps[prop.name] ?? {
        type: "static",
        value: prop.default_value,
      },
    });
  }

  return createModal({
    $data: { props },
    name: `component-${id}-settings`,
    title: "Component Settings",
    actions: [
      Button({ onClick: "$modal.close()" }, "Cancel"),
      Button(
        {
          onClick: runAction("set_props", `{id: '${id}', props}`, reload()),
          color: "primary",
        },
        "Save"
      ),
    ],
    body: Col({ col: 12 }, [
      FormField(
        {
          $for: "prop in props",
          label: View({ $text: "prop.name" }),
          style: "position: relative",
        },
        [
          ButtonGroup({ style: "position: absolute; top: 28px; right: 8px" }, [
            Button(
              {
                size: "sm",
                onClick: "prop.value.type = 'load'",
                $color: "prop.value.type === 'load' ? 'primary' : undefined",
              },
              Icon({ name: "database" })
            ),
            Button(
              {
                size: "sm",
                onClick: "prop.value.type = 'static'",
                $color: "prop.value.type === 'static' ? 'primary' : undefined",
              },
              Icon({ name: "star" })
            ),
          ]),
          Row({ $if: "prop.value.type === 'static'" }, [
            Input({ name: "prop.value.value" }),
          ]),
          Accordions(
            { $if: "prop.value.type === 'load'", style: "border: none" },
            [
              Card([
                Accordion({
                  style: "border-bottom: none",
                  header: View(
                    { d: "flex", w: 100, items: "center", justify: "between" },
                    ["Dynamic"]
                  ),
                  body: [
                    Row([
                      Input({ label: "Table", name: "prop.value.table" }),
                      Input({ label: "Field", name: "prop.value.field" }),

                      "Where...",
                    ]),
                  ],
                }),
              ]),
            ]
          ),
        ]
      ),
    ]),
  });
}

function EditorPageHeader({ page }) {
  return View(
    {
      d: "flex",
      p: "xs",
      align: "center",
      justify: "between",
      pb: "sm",
      $data: { edit_title: false, title: page.title },
    },
    [
      View({ tag: "h2", $if: "!edit_title" }, [
        View({ $text: "title" }),
        Button(
          { link: true },
          Icon({ size: "lg", onClick: "edit_title = true", name: "pencil" })
        ),
      ]),
      Row({ $if: "edit_title" }, [
        Input({ col: true, name: "title" }),
        Col(
          { col: 0 },
          Button(
            {
              onClick:
                "edit_title = false; " + runAction("update_title", "{title}"),
              color: "primary",
            },
            "Save"
          )
        ),
        Col(
          { col: 0 },
          Button(
            {
              onClick: `edit_title = false; title='${page.title}'`,
            },
            Icon({ name: "x" })
          )
        ),
      ]),
      ButtonGroup([
        Button({ href: "/admin/pages" }, "Back"),
        Button(
          { onClick: `$modal.open('preview-modal')`, color: "info" },
          "Preview"
        ),
        Button({ color: "primary" }, "Publish"),
      ]),
    ]
  );
}

function EditorPage({ page, components }) {
  const htmlHead = [style];

  return Page(
    {
      htmlHead,
      container: false,
      $data: {
        placement: "",
        position: "",
        contextmenuOpen: false,
        x: 0,
        y: 0,
        id: "",
      },
    },
    [
      View({ d: "flex", flexDirection: "column" }, [
        ContextMenu(),
        EditorPageHeader({ page }),
        View(
          {
            m: "xs",
            style: "height: calc(100vh - 132px); overflow-y: auto",
            bgColor: "base-200",
            h: 100,
            border: true,
            borderColor: "base-400",
            d: "flex",
            flexDirection: "column",
          },
          [
            page.content.map((x) => ComponentContent(x)),
            Placeholder({ placement: "after", id: "" }),
          ]
        ),
      ]),
      page.content.map((x) => ComponentRemoveModal({ id: x.id })),
      page.content.map((item) => ComponentSettingsModal(item)),
      PreviewModal(page),
      ComponentAddModal({ components }),
    ]
  );
}

function ComponentRemoveModal({ id }) {
  return createModal({
    name: `component-${id}-remove`,
    title: "Remove Component",
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          onClick: runAction("remove_component", `{id: ${id}}`, reload()),
          color: "error",
        },
        "Remove"
      ),
    ],
    body: "Are you sure to remove this component from Page?",
  });
}

function ComponentAddModal({ components }) {
  return createModal({
    $data: { active: "" },
    name: "add-component",
    title: "Add Component in Page",
    actions: [
      Button({ onClick: "$modal.close()" }, "Cancel"),
      Button(
        {
          onClick: runAction(
            "add_component",
            "{position, placement, component_id: active}",
            // openModal("component-settings")
            reload()
          ),
          color: "primary",
        },
        "Add"
      ),
    ],
    body: [
      components.map((component) =>
        Col({ col: 3 }, [
          View(
            {
              class: "component-item",
              $class: `active === '${component.id}' ? 'active' : ''`,
              onClick: `active = '${component.id}'`,
              border: true,
              borderColor: "base-400",
              p: "md",
              d: "flex",
              flexDirection: "column",
              align: "center",
              justify: "center",
            },
            [component.name]
          ),
        ])
      ),
    ],
  });
}

export default EditorPage;
