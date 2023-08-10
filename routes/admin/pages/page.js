import { PageList } from "./PageList.js";

export async function convert_to_template({ctx, body}) {
  await ctx.table('pages').update(body.id, {
    is_template: true
  })

  return {
    body: {
      success: true
    }
  }
}

export async function convert_to_page({ctx, body}) {
  await ctx.table('pages').update(body.id, {
    is_template: false
  })

  return {
    body: {
      success: true
    }
  }
}


export async function remove_page({ctx, body}) {
  await ctx.table('pages').remove(body.id)

  return {
    body: {
      success: true
    }
  }
}


export async function update_page({ctx, body}) {
  await ctx.table('pages').update(body.id, {
    title: body.title,
    slug: body.slug,
    head: body.head,
    is_template: body.is_template
  })

  return {
    body: {
      success: true
    }
  }
}

export async function add({ ctx, body }) {
  console.log ('add page', body)
  const head = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://unpkg.com/@ulibs/ui@next/dist/styles.css"/>
  <script src="https://unpkg.com/@ulibs/ui@next/dist/ulibs.js"></script>
`
  const page = {
    title: body.title,
    slug: body.slug,
    is_template: body.is_template,
    head: body.head ?? head,
    content: body.content ?? [],
  };
  const [id] = await ctx.table("pages").insert(page);


  return {
    body: {
      success: true,
      id
    },
  };
}

export async function load({ ctx }) {
  const pages =await ctx
  .table("pages")
  .query({ perPage: 100 })
  .then((res) => res.data)


  return {
    pages,
  };
}

export default PageList;
