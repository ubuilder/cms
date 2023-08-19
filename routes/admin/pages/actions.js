import { cloneInstance } from "../../../utils/instance.js";

export async function convert_to_template({ ctx, body }) {
  await ctx.table('pages').update(body.id, {
    is_template: true,
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function convert_to_page({ ctx, body }) {
  await ctx.table('pages').update(body.id, {
    is_template: false,
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function remove_page({ ctx, body }) {
  await ctx.table('pages').remove(body.id);

  return {
    body: {
      success: true,
    },
  };
}

export async function update_page({ ctx, body }) {
  await ctx.table('pages').update(body.id, {
    title: body.title,
    slug: body.slug,
    // head: body.head,
    is_template: body.is_template,
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function add({ ctx, body }) {
  const head_shared = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page.title}}</title>
    <meta name="description" content="{{page.description}}">  
  `
  const heads = {
    ulibs: `
    <link rel="preconnect" href="https://unpkg.com">
    <link rel="preconnect" href="https://cdn.quilljs.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
  
    <link rel="preconnect" href="https://cdn.jsdeliver.net">
  
    <link
      rel="stylesheet"
      href="https://unpkg.com/@ulibs/ui@next/dist/styles.css"
      media="print" 
      onload="this.media='all'; this.onload = null"
    >
    <script defer src="https://unpkg.com/@ulibs/ui@next/dist/ulibs.js"></script>
  `,
  "bootstrap": `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
`}


  const page = {
    title: body.title,
    slug: body.slug,
    is_template: false,
    description: body.description ?? "NO DESCRIPTION",
    // head: body.head ?? head,
    head: head_shared + (heads[body.theme] ?? 'bootstrap') ,
    theme: body.theme
  };
  const [id] = await ctx.table('pages').insert(page);

  let instance_id;
  if (body.slot_id) {
    const [instanceId] = await cloneInstance(ctx, body.slot_id);

    instance_id = instanceId;
  } else {
    const [instanceId] = await ctx.table('instances').insert({
      component_id: "000",
      slot_ids: [],
      props: {
        template: {
          type: "static",
          value: "{{{slot}}}",
        },
      },
    });

    instance_id = instanceId;
  }

  await ctx.table('pages').update(id, {
    slot_id: instance_id,
  });

  return {
    body: {
      success: true,
      id,
    },
  };
}
