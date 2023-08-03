import {
  Accordion,
  Accordions,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Col,
  Divider,
  TextEditor,
  FormField,
  Icon,
  Input,
  Modal,
  Popover,
  Row,
  Select,
  Switch,
  Tabs,
  TabsContent,
  TabsItem,
  TabsList,
  TabsPanel,
  Tooltip,
  View,
} from "@ulibs/ui";
import { Page } from "../../../../../components/Page.js";
import { Sidebar } from "../../../../../components/sidebar.js";
import { createModal } from "../../../../../components/createModal.js";
import hbs from "handlebars";
import page from "../../[id]/page.js";

const style = `
  <style>
  .item {
    width: max-content;
    display: contents;
    padding: var(--size-sm);
    border: 1px dashed var(--color-base-400);
  }
  
  .item:hover {
    border: 1px solid var(--color-primary-500);
  }
  
  .placeholder {
    background-image: repeating-linear-gradient(45deg, var(--color-base-300), var(--color-base-300) 2px,var(--color-base-400) 2px,var(--color-base-400) 4px);
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--size-md);
    gap: var(--size-xs);
    border: 1px dashed var(--color-primary-200);
    opacity: 0.5;
  }
  .placeholder:hover {
    border: 1px solid var(--color-primary-500);
  }
  
  .component-item {
  
  }
  .component-item:hover {
    border: 1px solid var(--color-primary-300);
  }
  
  .component-item.active {
    border: 1px solid var(--color-primary-500);
    background-color: var(--color-base-300);
  }
  </style>
  
  `;


export async function load({ ctx, params }) {
  const id = params.id;

  const page = await ctx.table("pages").get({ where: { id } });

  const components = await ctx.table("components").query({ perPage: 100 });

  for (let item of page.content) {
    console.log(item);
    const component = await ctx
      .table("components")
      .get({ where: { id: item.component_id } });

    const itemProps = {}

      for (let propName in item.props) {
        const prop = item.props[propName];

        if (typeof prop === "object") {
          const res = await ctx
            .table(prop.table)
            .get({ where: prop.where, select: { [prop.field]: true } });

          itemProps[propName] = res[prop.field]

        } else {
            itemProps[propName] = prop;
        }
      }
      

    function renderItem() {
      const props = {};

      const template = component.template;

      component.props.map((prop) => {
        props[prop.name] = itemProps[prop.name] ?? prop.default_value;
      });

      props.slot = Placeholder();

      return hbs.compile(template)(props);
    }

    // render hbs
    item.content = renderItem();
    item.component = component;
    console.log(item);
  }

  console.log({ page });
  return {
    page,
    components: components.data,
  };
}

function Placeholder() {
  return View(
    {
      class: "placeholder",
      onClick: "$event.stopPropagation(); $modal.open('add-component')",
    },
    [[Icon({ size: "lg", name: "plus" }), "Click to add Component"]]
  );
}

function renderComponent(id, content) {
  //   props.slot = Placeholder();

  return View({ class: "item" }, [
    content,
    Popover({ placement: "top-end", trigger: "hover", p: 0, gap: 0 }, [
      ButtonGroup({ compact: true, style: "border-radius: 0" }, [
        Button(
          {
            size: "sm",
            onClick: `$modal.open('component-${id}-settings')`,
          },
          [Icon({ name: "settings" })]
        ),
        Button(
          {
            size: "sm",
            color: "error",
            onClick: `$modal.open('component-${id}-remove')`,
          },
          Icon({ name: "x" })
        ),
      ]),
    ]),
  ]);
}

function renderComponentSettings(
  id,
  { props: componentProps, name, template } = {},
  instanceProps = {}
) {
  const props = [];

  console.log("renderComponentSettings", id, {
    componentProps,
    name,
    template,
    instanceProps,
  });

  for (let prop of componentProps) {
    props.push({
      name: prop.name,
      value: instanceProps[prop.name] ?? prop.default_value,
      dynamic: typeof instanceProps[prop.name] === "object",
    });
  }

  return createModal({
    $data: { props },
    name: `component-${id}-settings`,
    title: "Component Settings",
    actions: [
      Button({ onClick: "$modal.close()" }, "Cancel"),
      Button({ onClick: `$modal.close()`, color: "primary" }, "Save"),
    ],
    body: Col({ col: 12 }, [
      FormField(
        {
          $for: "prop in props",
          label: View({ $text: "prop.name" }),
          style: "position: relative",
        },
        [
          Button(
            {
              style: "position: absolute; top: 28px; right: 8px",
              size: "sm",
              onClick: "prop.dynamic = !prop.dynamic",
              $color: "prop.dynamic ? 'primary' : undefined",
            },
            Icon({ name: "star" })
          ),
          Row({ $if: "!prop.dynamic" }, [Input({ name: "prop.value" })]),
          Accordions({ $if: "prop.dynamic", style: "border: none" }, [
            Card(
              [
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
              ]
              // Row({ align: "center", style: "position: relative" }, [
              //   Input({
              //     label: prop.name,
              //     col: true,
              //     style: "--form-field-size: var(--size-sm)",
              //   }),
              //   Col(
              //     {
              //       col: 0,
              //       style: "position: absolute; top: 4px; right: 4px",
              //       size: "sm",
              //     },
              //     [
              //       Button(
              //         {
              //           color: "primary",
              //           size: "sm",
              //           style: "text-align: unset",
              //         },
              //         [
              //           Icon({ name: "star" }),
              //           Popover(
              //             {
              //               placement: "bottom-end",
              //               arrow: true,
              //               trigger: "hover",
              //               persistant: true,
              //             },
              //             [
              //               Col(
              //                 {},
              //                 View(
              //                   { tag: "h4", my: "xxs" },
              //                   "Use Dynamic Value"
              //                 )
              //               ),
              //               Input({ label: "Table" }),
              //               Input({ label: "Field" }),
              //               FormField({ label: "Where" }, [
              //                 Select({
              //                   items: ["field1", "field2", "field3"],
              //                   placeholder: "field",
              //                 }),
              //                 "...",
              //               ]),
              //             ]
              //           ),
              //         ]
              //       ),
              //     ]
              //   ),
              // ])
            ),
          ]),
        ]
      ),
    ]),
  });
}

export default ({ page, components }) => {
  return Page(
    {
      htmlHead: style,
      container: false,
    },
    Row({ m: 0, align: "stretch" }, [
      false &&
        Col(
          { p: 0, col: 0 },
          View(
            {
              bgColor: "base-200",
              h: 100,
              style:
                "height: calc(100vh - 64px); border-right: 1px solid var(--color-base-400)",
            },
            [
              Tabs(
                {
                  style: "border: none; width: calc(var(--size-6xl) * 2)",
                  d: "flex",
                  flexDirection: "column",
                  h: 100,
                },
                [
                  TabsList([TabsItem("Content"), TabsItem("Item 2")]),
                  TabsContent({ h: 100 }, [
                    TabsPanel({ bgColor: "base-100", h: 100 }, ["Panel 1"]),
                    TabsPanel({ bgColor: "base-100", h: 100 }, ["Panel 2"]),
                  ]),
                ]
              ),
            ]
          )
        ),

      Col({ p: 0, col: true, d: "flex", flexDirection: "column" }, [
        View(
          { d: "flex", p: "xs", align: "center", justify: "between", pb: "sm" },
          [
            View({ tag: "h3" }, "Page Editor"),
            ButtonGroup([
              Button({ href: "/admin/pages/" + page.id }, "Cancel"),
              Button({ color: "primary" }, "Save"),
            ]),
          ]
        ),
        View(
          {
            p: "xs",
          },
          [
            View(
              {
                style: "height: calc(100vh - 132px); overflow-y: auto",
                bgColor: "base-200",
                h: 100,
                border: true,
                borderColor: "base-400",
              },
              [
                page.content.map((x) => renderComponent(x.id, x.content)),
                Placeholder(),
              ]
            ),
          ]
        ),
      ]),
      false &&
        Col(
          { p: 0, col: 0 },
          View(
            {
              bgColor: "base-200",
              h: 100,
              style:
                "height: calc(100vh - 64px); border-left: 1px solid var(--color-base-400)",
            },
            [
              Tabs(
                {
                  style: "border: none; width: calc(var(--size-6xl) * 2)",
                  d: "flex",
                  flexDirection: "column",
                  h: 100,
                },
                [
                  TabsList([TabsItem("Properties"), TabsItem("Data")]),
                  TabsContent({ h: 100 }, [
                    TabsPanel({ p: 0, bgColor: "base-100", h: 100 }, [
                      Accordions([
                        Accordion({
                          header: View(
                            {
                              d: "flex",
                              align: "center",
                              justify: "between",
                              w: "100",
                            },
                            "Props:"
                          ),
                          body: Row({ align: "end" }, [
                            Col(
                              { col: 12 },
                              Row(
                                {
                                  align: "center",
                                  style: "position: relative",
                                },
                                [
                                  Col(
                                    {
                                      col: 4,
                                      style:
                                        "white-space: nowrap;overflow: hidden;text-overflow: ellipsis;",
                                    },
                                    "Name"
                                  ),
                                  Input({
                                    col: true,
                                    style: "--form-field-size: var(--size-sm)",
                                  }),
                                  Col(
                                    {
                                      col: 0,
                                      style:
                                        "position: absolute; top: 4px; right: 4px",
                                      size: "sm",
                                    },
                                    [
                                      Button(
                                        {
                                          color: "primary",
                                          size: "sm",
                                          style: "text-align: unset",
                                        },
                                        [
                                          Icon({ name: "star" }),
                                          Popover(
                                            {
                                              placement: "bottom-end",
                                              arrow: true,
                                              trigger: "hover",
                                              persistant: true,
                                            },
                                            [
                                              Col(
                                                {},
                                                View(
                                                  { tag: "h4", my: "xxs" },
                                                  "Use Dynamic Value"
                                                )
                                              ),
                                              Input({ label: "Table" }),
                                              Input({ label: "Field" }),
                                              FormField({ label: "Where" }, [
                                                Select({
                                                  items: [
                                                    "field1",
                                                    "field2",
                                                    "field3",
                                                  ],
                                                  placeholder: "field",
                                                }),
                                                "...",
                                              ]),
                                            ]
                                          ),
                                        ]
                                      ),
                                    ]
                                  ),
                                ]
                              )
                            ),
                            Col(
                              { col: 12 },
                              Row(
                                {
                                  align: "center",
                                  style: "position: relative",
                                },
                                [
                                  Col(
                                    {
                                      col: 4,
                                      style:
                                        "white-space: nowrap;overflow: hidden;text-overflow: ellipsis;",
                                    },
                                    "Color"
                                  ),
                                  Input({
                                    col: true,
                                    style: "--form-field-size: var(--size-sm)",
                                  }),
                                  Col(
                                    {
                                      col: 0,
                                      style:
                                        "position: absolute; top: 4px; right: 4px",
                                      size: "sm",
                                    },
                                    [
                                      Button(
                                        {
                                          color: "primary",
                                          size: "sm",
                                          style: "text-align: unset",
                                        },
                                        [
                                          Icon({ name: "star" }),
                                          Popover(
                                            {
                                              placement: "bottom-end",
                                              arrow: true,
                                              trigger: "hover",
                                              persistant: true,
                                            },
                                            [
                                              Col(
                                                {},
                                                View(
                                                  { tag: "h4", my: "xxs" },
                                                  "Use Dynamic Value"
                                                )
                                              ),
                                              Input({ label: "Table" }),
                                              Input({ label: "Field" }),
                                              FormField({ label: "Where" }, [
                                                Select({
                                                  items: [
                                                    "field1",
                                                    "field2",
                                                    "field3",
                                                  ],
                                                  placeholder: "field",
                                                }),
                                                "...",
                                              ]),
                                            ]
                                          ),
                                        ]
                                      ),
                                    ]
                                  ),
                                ]
                              )
                            ),
                            Col(
                              { col: 12 },
                              Row(
                                {
                                  align: "center",
                                  style: "position: relative",
                                },
                                [
                                  Col(
                                    {
                                      col: 4,
                                      style:
                                        "white-space: nowrap;overflow: hidden;text-overflow: ellipsis;",
                                    },
                                    "Sizewwadfweeafawe afawef"
                                  ),
                                  Input({
                                    col: true,
                                    style: "--form-field-size: var(--size-sm)",
                                  }),
                                  Col(
                                    {
                                      col: 0,
                                      style:
                                        "position: absolute; top: 4px; right: 4px",
                                      size: "sm",
                                    },
                                    [
                                      Button(
                                        {
                                          color: "primary",
                                          size: "sm",
                                          style: "text-align: unset",
                                        },
                                        [
                                          Icon({ name: "star" }),
                                          Popover(
                                            {
                                              placement: "bottom-end",
                                              arrow: true,
                                              trigger: "hover",
                                              persistant: true,
                                            },
                                            [
                                              Col(
                                                {},
                                                View(
                                                  { tag: "h4", my: "xxs" },
                                                  "Use Dynamic Value"
                                                )
                                              ),
                                              Input({ label: "Table" }),
                                              Input({ label: "Field" }),
                                              FormField({ label: "Where" }, [
                                                Select({
                                                  items: [
                                                    "field1",
                                                    "field2",
                                                    "field3",
                                                  ],
                                                  placeholder: "field",
                                                }),
                                                "...",
                                              ]),
                                            ]
                                          ),
                                        ]
                                      ),
                                    ]
                                  ),
                                ]
                              )
                            ),
                          ]),
                        }),
                      ]),
                    ]),
                    TabsPanel({ p: 0, bgColor: "base-100", h: 100 }, [
                      Accordions([
                        Accordion({
                          open: true,
                          header: View(
                            {
                              d: "flex",
                              align: "center",
                              justify: "between",
                              w: "100",
                            },
                            "General"
                          ),
                          body: Row({ align: "end" }, [
                            Select({
                              col: 12,
                              label: "Table",
                              items: ["Users", "Blogs", "News", "Products"],
                            }),
                            Select({
                              col: 12,
                              label: "Field",
                              items: [
                                "Id",
                                "Name",
                                "Username",
                                "Product Name",
                                "...",
                              ],
                            }),
                          ]),
                        }),
                        Accordion({
                          $data: { filters: [] },
                          header: "Filters:",
                          body: Row([
                            Col({ col: 12 }, [
                              Row(
                                {
                                  $for: "filter, index in filters",
                                  align: "end",
                                },
                                [
                                  Select({ col: true, placeholder: "Field" }),
                                  Select({
                                    col: 0,
                                    placeholder: "Op",
                                    items: ["=", "!=", "<", "<=", ">", ">="],
                                  }),
                                  Select({ col: true, placeholder: "Value" }),
                                  Col({ col: 0 }, [
                                    Button(
                                      { onClick: "filters.splice(index, 1)" },
                                      Icon({ name: "minus" })
                                    ),
                                  ]),
                                ]
                              ),
                            ]),
                            Col({ col: 12 }, [
                              Button(
                                {
                                  onClick:
                                    "filters.push({field: '', operator: '=', value: ''})",
                                },
                                [Icon({ name: "plus" }), "Add Filter"]
                              ),
                            ]),
                          ]),
                        }),
                      ]),
                    ]),
                  ]),
                ]
              ),
            ]
          )
        ),
      page.content.map((item) =>
        createModal({
          name: `component-${item.id}-remove`,
          title: "Remove Component",
          actions: [
            Button({ onClick: "$modal.close()" }, "Cancel"),
            Button({ onClick: `$modal.close()`, color: "error" }, "Remove"),
          ],
          body: "Are you sure to remove this component from Page?",
        })
      ),

      page.content.map((item) =>
        renderComponentSettings(item.id, item.component, item.props)
      ),
      createModal({
        $data: { active: "" },
        name: "add-component",
        title: "Add Component in Page",
        actions: [
          Button({ onClick: "$modal.close()" }, "Cancel"),
          Button({ onClick: `$modal.close()`, color: "primary" }, "Add"),
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
      }),
    ])
  );
};
