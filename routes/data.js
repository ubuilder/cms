import {View} from '@ulibs/ui'

export default function data(ctx) {
    console.log('data initialized');

    ctx.addLayout('/data', {
        component(props, slots) {
            return ['<div><a href="/data/create">Create New Table</a> | <a href="/data/users">View Table users</a> | <a href="/data/users/edit">Edit Table users</a> | <a href="/data/users/1">Edit user 1</a> | <a href="/data/users/insert">insert new user</a> </div>', slots].join('')
        }
    })


    ctx.addPage('/data', {
        page: () => View('List of tables!')
    })

    ctx.addPage('/data/create', {
        page: () => View('Create new table.')
    })
    

    ctx.addPage('/data/:table', {
        page: () => View('Detail of a table with list of it\'s item.')
    })

    ctx.addPage('/data/:table/edit', {
        page: () => View('Edit table info and fields')
    })
    
    ctx.addPage('/data/:table/insert', {
        page: () => View('insert new item to table')
    })

    ctx.addPage('/data/:table/:row', {
        page: () => View('Edit single data item')
    })

}