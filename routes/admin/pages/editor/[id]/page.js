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
  Datepicker,
  FormField,
  Icon,
  Input,
  Modal,
  TextEditor,
  Switch,
  Popover,
  Row,
  Tooltip,
  View,
  Textarea,
  Divider,
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
import { PageHeader } from "../../../../../components/PageHeader.js";

const style = `
  <style>
  [u-cloak] {display: none;}

  .item {
    display: contents;
  }

  .item > :not(.placeholder) {
    
    transition: all 0.2s ease;
    position: relative;
    min-height: var(--size-md);
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    min-height: var(--size-xl);
  }

  .item > :not(.placeholder):hover {
    border: 1px dashed var(--color-primary-400);
    
  }
  .item.active > :not(.placeholder) {
    border: 1px solid var(--color-primary-500);
    background-color: var(--color-primary-100);
  }
  
  .placeholder {
    transition: all 0.2s ease;
    min-width: var(--size-sm);
    background-image: repeating-linear-gradient(45deg, var(--color-base-300), var(--color-base-300) 2px,var(--color-primary-100) 2px,var(--color-primary-100) 4px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--size-md);
    gap: var(--size-xs);
    border: 1px dashed var(--color-primary-200);
    opacity: 1;
    width: 100%;

  }

  .placeholder-md {
    height: var(--size-xl);
  }

  .placeholder-sm {
    height: 0;
    display: none;

  }

  .item.active  > .placeholder-sm {
    height: calc(var(--size-sm));
    border: 1px solid var(--color-primary-200);
    top: 0;
    bottom: 0;
  }

  .item.active  > .placeholder-sm.placeholder-before {
    bottom: calc(100% + 1px);
    top: auto;
    left: -1px;
    right: -1px;
  }

  .item.active > .placeholder-sm.placeholder-after {
    left: -1px;
    right: -1px;
    bottom: auto;
    top: calc(100% + 1px);
  }

  .placeholder-slot {
    min-height: var(--size-xl);
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

  function check_insert(item, parent) {
    console.log("check_insert", { item, parent });
    if (item.id == body.position) {
      if (body.placement === "before") {
        parent.push(newItem);
        parent.push(item);
      } else if (body.placement === "after") {
        parent.push(item);
        parent.push(newItem);
      } else {
        item.slot ??= [];
        item.slot.push(newItem);
        parent.push(item);
      }
      // slot
    } else {
      if (item.slot) {
        let slot = [];
        for (let x of item.slot) {
          check_insert(x, slot);
        }
        item.slot = slot;
      }
      parent.push(item);
    }
  }

  for (let item of page.content) {
    check_insert(item, content);
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

  function update_props(item, parent) {
    if (item.id == itemId) {
      for (let prop of props) {
        item.props[prop.name] = prop.value;
      }
    } else {
      if (item.slot) {
        let slot = [];
        for (let x of item.slot) {
          update_props(x, slot);
        }
        item.slot = slot;
      }
    }
    parent.push(item);
  }

  for (let item of page.content) {
    update_props(item, content);
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

  function check_remove(item, parent) {
    if (item.id === itemId) return;
    if (item.slot) {
      const slot = [];
      for (let x of item.slot) {
        check_remove(x, slot);
      }
      item.slot = slot;
    }
    parent.push(item);
  }

  for (let item of page.content) {
    check_remove(item, content);
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

  async function renderItem(item) {
    const component = await ctx
      .table("components")
      .get({ where: { id: item.component_id } });

    item.component = component;
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

    const props = {};

    const template = component.template;
    const hasSlot = template.indexOf("{{slot}}" > -1);

    component.props.map((prop) => {
      props[prop.name] = itemProps[prop.name] ?? prop.default_value;
    });

    if (hasSlot) {
      //   console.log("xslot: ", item.slot)
      if (item.slot?.length > 0) {
        props.slot = (
          await Promise.all(
            item.slot.map(async (x) => {
              x.parent = item

              return ComponentContent({
                ...(await renderItem(x)),
                parent: item,
              });
            })
          )
        ).join("");
        //  Placeholder({ id: item.id, placement: "slot" })]
      } else {
        props.slot = [
          Placeholder({ name: component.name, id: item.id, placement: "slot" }),
        ];
      }
    }

    // render hbs
    item.content = hbs.compile(template)(props);

    return item;
  }

  for (let item of page.content) {
    item = await renderItem(item);
  }

  return {
    page,
    components: components.data,
  };
}

function Placeholder({ id, size = "md", placement, name } = {}) {
  return View(
    {
      class: `placeholder placeholder-${size} placeholder-${placement}`,
      onClick: `$event.stopPropagation(); id='${id}'; contextmenuOpen = false; position='${id}'; placement='${placement}'; if(position === '${id}') {${openModal(
        "add-component"
      )}}`,
    },
    false
      ? [[Icon({ size: "lg", name: "plus" }), "Click to add Component"]]
      : []
  );
}

function ContextMenu2(item) {
  function Content(item, mode = "static") {
    console.log('375: ', item);
    if (!item) return;
    return Card([
      CardBody(
        { p: "xxs" },
        [
         mode ==='static' ? View({ py: "xs", px: 'xxs' }, [item.component.name + " Settings"]) : '',

        ButtonGroup({ align: "center" }, [
          Button({ onClick: ``, size: 'sm'}, Icon({ name: "cut" })),
          Button({ onClick: ``, size: 'sm'}, Icon({ name: "copy" })),
          Button({ size: 'sm', onClick: `$modal.open('component-${item.id}-settings')` }, [
            Icon({ name: "settings" }),
          ]),
          Button({ size: 'sm', onClick: `$modal.open('component-${item.id}-remove')` }, [
            Icon({ name: "trash" }),
          ]),
          Button(
            {
              size: 'sm',
              onClick: ` position='${item.id}'; placement='before'; ${openModal(
                "add-component"
              )}`,
            },
            [Tooltip("Insert Before"), Icon({ name: "column-insert-left" })]
          ),
          Button(
            {
              size: 'sm',
              onClick: ` position='${item.id}'; placement='after'; ${openModal(
                "add-component"
              )}`,
            },
            [Tooltip("Insert After"), Icon({ name: "column-insert-right" })]
          ),
        ])
      ]
      ),
      item.parent ? Content(item.parent) : "",
   
    ]);
  }

  return View(
    {
      "u-cloak": true,
      "onClick.outside": "contextmenuOpen = false",
      onClick: "contextmenuOpen = false",
      $style: `(contextmenuOpen && id==='${item.id}') ? ('z-index: 2; min-height: auto; position: fixed; display: block; top: ' + y + 'px;' + 'left: ' + x + 'px') : 'display: none'`,
    },
    [
      Content(item, 'dynamic'),
    ]
  );
}

function ContextMenu() {
  return View(
    {
      "u-cloak": true,
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
  if (!item) return "";
  return View(
    {
      class: "item",
      // tabindex: 0,
      "onClick.outside": "id = ''; contextmenuOpen = false",
      // onDblclick: `$event.stopPropagation(); $modal.open('component-${item.id}-settings')`,
      $class: `id === '${item.id}' ? 'active' : ''`,
      onContextmenu: `$event.preventDefault(); $event.stopPropagation(); contextmenuOpen = false; id = '${item.id}'; if(id ==='${item.id}') { contextmenuOpen = true; x = $event.clientX; y = $event.clientY;} else {id = '${item.id}'}`,
      style: "cursor: default",
    },
    [
      // JSON.stringify({item}),
      Placeholder({
        id: item.id,
        placement: "before",
        size: "sm",
        name: "insert new component Here",
      }),
      item.content,
      ContextMenu2(item),
    ]
  );
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

  console.log({ componentProps });
  for (let prop of componentProps) {
    props.push({
      name: prop.name,
      value: instanceProps[prop.name] ?? {
        type: "static",
        value: prop.default_value,
      },
      type: prop.type,
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
            Input({
              $if: "prop.type === 'plain_text'",
              name: "prop.value.value",
            }),
            Textarea({
              $if: "prop.type === 'rich_text'",
              rows: 10,
              name: "prop.value.value",
            }),
            Input({
              $if: "prop.type === 'number'",
              type: "number",
              name: "prop.value.value",
            }),
            Datepicker({
              $if: "prop.type === 'date'",
              name: "prop.value.value",
            }),
            Switch({
              $if: "prop.type === 'boolean'",
              name: "prop.value.value",
            }),
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
  return PageHeader(
    {
      px: "xs",
      py: "xs",
      $data: { edit_title: false, title: page.title },
      title: View({ d: "flex" }, [
        View({ d: "flex", $if: "!edit_title" }, [
          View({ style: "text-wrap: nowrap", $text: "title" }),
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
      ]),
    },
    ButtonGroup([
      Button({ href: "/admin/pages" }, "Back"),
      Button(
        { onClick: `$modal.open('preview-modal')`, color: "info" },
        "Preview"
      ),
      Button({ color: "primary" }, "Publish"),
    ])
  );
}

function ComponentRemoveModals({ content }) {
  let result = [];
  content.map((item) => {
    result = [...result, ComponentRemoveModal({ id: item.id })];
    if (item.slot) {
      result = [...result, ...ComponentRemoveModals({ content: item.slot })];
    }
  });
  return result;
}

function ComponentSettingsModals({ content }) {
  let result = [];
  content.map((item) => {
    result = [
      ...result,
      ComponentSettingsModal({
        id: item.id,
        component: item.component,
        props: item.props,
      }),
    ];
    if (item.slot) {
      result = [...result, ...ComponentSettingsModals({ content: item.slot })];
    }
  });
  return result;
}

function ComponentRemoveModal({ id }) {
  return createModal({
    name: `component-${id}-remove`,
    title: "Remove Component",
    actions: [
      Button({ onClick: closeModal() }, "Cancel"),
      Button(
        {
          onClick: runAction("remove_component", `{id: '${id}'}`, reload()),
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

function EditorPage({ page, components }) {
  const htmlHead = [style];
  console.log(page.content.map((content) => content.component));

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
      onClick: "id = ''",
    },
    [
      View({ d: "flex", flexDirection: "column" }, [
        // ContextMenu(),
        EditorPageHeader({ page }),
        View(
          {
            p: "xs",
          },
          [
            View(
              {
                style:
                  "height: calc(100vh - 132px); overflow-y: auto; outline: none; box-shadow: 0 0 4px var(--color-base-700);",
                onKeydown: `console.log($event); if($event.code === 'Space')  {$modal.open('component-' + id + '-settings')} else if($event.code ===   'Escape') {id = ''}`,
                bgColor: "base-100",
                tabindex: "0",
                h: 100,
                border: true,
                borderColor: "base-700",
              },
              [
                page.content.map((x) => ComponentContent(x)).join(""),
                page.content.length == 0 &&
                  Placeholder({ placement: "after", id: "" }),
              ]
            ),
          ]
        ),
      ]),
      ComponentRemoveModals(page),
      ComponentSettingsModals(page),
      PreviewModal(page),
      ComponentAddModal({ components }),
    ]
  );
}

export default EditorPage;
