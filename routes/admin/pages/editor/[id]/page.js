import { uuid } from "uuidv4";
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
import { ComponentAddModal } from "./ComponentModals.js";
import { ItemModals } from "./ItemModals.js";
import { Placeholder } from "./Placeholder.js";
import { Item } from "./Item.js";
import { EditorPageHeader } from "./Header.js";
import { Styles } from "./styles.js";
import { PreviewModal } from "./PreviewModal.js";


export async function convert_to_component({ ctx, body, params }) {
  const { id } = body;
  const pageId = params.id;

  const page = await ctx.table("pages").get({ where: { id: pageId } });

  function find_item(content) {
    let result;

    for (let item of content) {
      if (item.id === id) {
        result = item;
        break;
      }

      if (item.slot && item.slot.length > 0) {
        find_item(item.slot);
      }
    }

    return result;
  }

  const result = find_item(page.content);

  console.log({ result });

  const component = await ctx
    .table("components")
    .get({ where: { id: result.component_id } });

  const newComponent = {
    name: body.name,
    template: component.template,
    props: {},
    // content: result.
  };

  console.log({ result, component, newComponent });
}

export async function add_component({ ctx, body, params }) {
  const id = params.id;
  const page = await ctx.table("pages").get({ where: { id } });

  const newItem = {
    id: uuid(),
    component_id: body.component_id,
    props: body.props ?? {},
  };

  let content = [];

  function check_insert(item, parent) {
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
    content.push(newItem);
  }

  page.content = content;
  await ctx.table("pages").update(id, page);

  await set_props({
    ctx,
    body: {
      props: body.props,
      id: newItem.id,
    },
    params: { id: params.id },
  });
  return {
    body: {
      success: true,
    },
  };
}

export async function set_props({ ctx, body, params }) {
  const props = body.props;

  const pageId = params.id;
  const itemId = body.id;

  const page = await ctx.table("pages").get({ where: { id: pageId } });

  let content = [];

  function update_props(item, parent) {
    if (item.id === itemId) {
      item.props = {};
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
      if (item.slot?.length > 0) {
        props.slot = (
          await Promise.all(
            item.slot.map(async (x) => {
              x.parent = item;

              return Item({
                item: {
                  ...(await renderItem(x)),
                  parent: item,
                },
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


function PageContainer(props, slot) {
  return Col({ col: 12 }, [
    View(
      {
        ...props,
        style:
          "height: calc(100vh - 132px); overflow-y: auto; outline: none; box-shadow: 0 0 4px var(--color-base-700);",
        onKeydown: `if($event.code === 'Space')  {$modal.open('component-' + id + '-settings')} else if($event.code ===   'Escape') {id = ''}`,
        bgColor: "base-100",
        tabindex: "0",
        m: "xs",
        h: 100,
        border: true,
        borderColor: "base-700",
      },
      slot
    ),
  ]);
}


function EditorPage({ page, components }) {

  return Page(
    {
      container: false,
      $data: {
        clipboard: {},
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
      Styles(),
      EditorPageHeader({ page }),
      PageContainer({}, [
        page.content.map((x) => Item({ item: x })),
        page.content.length == 0 && Placeholder({ placement: "after", id: "" }),
      ]),
      ItemModals({ content: page.content }),
      PreviewModal(page),
      ComponentAddModal({ components }),
    ]
  );
}

export default EditorPage;
