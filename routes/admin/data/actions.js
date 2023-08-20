import { slugify } from "../../../utils/slugify.js";

export async function update_table({ ctx, body }) {
  const id = body.id;
  const payload = {
    name: body.name,
    icon: body.icon,
    fields: body.fields,
  };

  await ctx.table("tables").update(id, payload);

  return {
    status: 200,
    body: {
      message: {
        type: "success",
        content: "Table Successfully updated!",
      },
      result: true,
    },
  };
}

export async function remove_table({ ctx, body }) {
  const id = body.id;

  await ctx.table("tables").remove(id);

  return {
    status: 200,
    body: {
      message: {
        type: "success",
        content: "Table Successfully deleted!",
      },
      result: true,
    },
  };
}

export async function create_table({ ctx, body }) {
  const newTable = {
    name: body.name,
    icon: body.icon,
    slug: slugify(body.name),
    fields: body.fields,
  };

  const result = await ctx.table("tables").insert(newTable);

  return {
    status: 201,
    body: {
      message: {
        type: "success",
        content: "Table Successfully created!",
      },
      result: true,
    },
  };
}
