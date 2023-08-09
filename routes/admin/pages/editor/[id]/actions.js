import { uuid } from "uuidv4";

async function getPage(ctx, id) {
  const page = await ctx.table('pages').get({where: {id}});

  return page;
}

async function getComponent(ctx, id) {
  const component = await ctx.table("components").get({ where: { id } });

  return component;
}

export async function convert_to_component({ ctx, body, params }) {
  const { id } = body;
  const pageId = params.id;

  const page = await getPage(ctx, pageId);

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

  const component = await getComponent(ctx, result.component_id);

  const newComponent = {
    name: body.name,
    template: component.template,
    props: {},
    // content: result.
  };

  console.log({ result, component, newComponent });
}

export async function add_component({ ctx, body, params }) {
  const page = await getPage(ctx, params.id);

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

  const page = await getPage(ctx, pageId);

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

  const page = await getPage(ctx, pageId);

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
  const page = await getPage(ctx, params.id);

  await ctx.table("pages").update(page.id, { title });

  return {
    body: {
      success: true,
    },
  };
}
