import { Instances, Pages } from "../../../models.js"

export async function convert_to_template({ body}) {
    await Pages.update(body.id, {
      is_template: true
    })
  
    return {
      body: {
        success: true
      }
    }
  }
  
  export async function convert_to_page({ body}) {
    await Pages.update(body.id, {
      is_template: false
    })
  
    return {
      body: {
        success: true
      }
    }
  }
  
  
  export async function remove_page({ body}) {
    await Pages.remove(body.id)
  
    return {
      body: {
        success: true
      }
    }
  }
  
  
  export async function update_page({ body}) {
    await Pages.update(body.id, {
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
  
  export async function add({  body }) {
  
    const head = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page.title}}</title>
    <meta name="description" content="{{page.description}}">
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
  `
    const page = {
      title: body.title,
      slug: body.slug,
      is_template: body.is_template,
      description: body.description ?? 'NO DESCRIPTION',
      head: body.head ?? head,
    };
    const [id] = await Pages.insert(page);
  
    const [instanceId] = await Instances.insert({
      component_id: '000',
      slot_ids: [],
      props: {
        template: {
          type: 'static',
          value: '{{{slot}}}'
        }
      }
    })
  
    await Pages.update(id, {
      slot_id: instanceId
    })
  
  
    return {
      body: {
        success: true,
        id
      },
    };
  }
  