export default function pages(ctx) {
    // 
    // manage pages and page editor

    ctx.addLayout('/pages', {
        component(props, slots) {
            return ['<div><a href="/pages/create">Create New Page</a> | <a href="/pages/1">View Page 1</a> | <a href="/pages/1/edit">Edit Page 1</a>  </div>', slots].join('')
        }
    })

    ctx.addPage('/pages', {
        page: 'Show list of pages'
    })

    ctx.addPage('/pages/create', {
        page: 'Create new page'
    })

    ctx.addPage('/pages/:id/edit', {
        page: 'Edit page settings'
    })

    ctx.addPage('/pages/:id', {
        page: 'View page based on unique id'
    })

}