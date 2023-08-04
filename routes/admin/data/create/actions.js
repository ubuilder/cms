import { slugify } from "../../../../utils/slugify.js";

function success({message = 'Success', data = undefined} = {}) {
  return {
    status: 200,
    body: {
      message,
      data
    }
  }
}

export async function updateTable(ctx, body) {
  const id = body.id;
  const payload = {
    name: body.name,
    icon: body.icon,
  };
  const table = await ctx.Tables.get({where: {id}})

  await ctx.Tables.update(id, payload);

  await syncTableFields(ctx, { fields: body.fields, table_id: id, table_name: table.slug });
}

export async function createTable(ctx, body) {
  const newTable = {
    name: body.name,
    icon: body.icon,
    slug: slugify(body.name),
  };

  const result = await ctx.Tables.insert(newTable);
  const table_id = result[0];

  await ctx.createTable(newTable.slug, {});

  await syncTableFields(ctx, { fields: body.fields, table_id, table_name: newTable.slug });

  //   todo: add fields
  return success({data: result});
}

export async function syncTableFields(ctx, { fields, table_id, table_name }) {
 
  for (let field of fields) {
    if (field.new) {
      const payload = {
        table_id,
        name: field.name,
        slug: slugify(field.name),
        hint: field.hint,
        default: field.default_value,
        required: field.required,
      };

      await ctx.Fields.insert(payload);

      // await ctx.addColumns(table_name, {
      //   [slugify(field.name)]: "string" + (field.required ? "|required" : ""),
      // });

      // create field
    } else if (field.removed) {
      const id = field.id;
      await ctx.Fields.remove(id);

      //
      console.log('remove columns', table_name, [slugify(field.name)])
      // await ctx.removeColumns(table_name, [slugify(field.name)]);
    } else {
      const id = field.id;
      const payload = {
        name: field.name,
        hint: field.hint,
        default: field.default_value,
        required: field.required,
      };

      await ctx.Fields.update(id, payload);


      // check if need update
      // await ctx.updateColumn(table_name, slugify(field.name), "string" + (field.required ? "|required" : ""))

    }
  }
}

export async function insertData(ctx, body) {
  const {table, data} = body

  const [id] = await ctx.getModel(table).insert(data);

  return success({data: id})
}

export async function updateData(ctx, body) {
  const {id, table, data} = body

  const result = await ctx.getModel(table).update(id, data)

  return success({data: result}) 
}

export async function removeData(ctx, body) {
  const {table, id} = body

  await ctx.getModel(table).remove(id);

  return success()

}