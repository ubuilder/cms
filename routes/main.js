import { AdminLayout } from "./main.view.js"

export default function main(ctx) {

    ctx.addLayout('/', {
        load() {
            return {user: {
                name: 'hadi',
                username: 'hadiahmadi',
                email: 'thehadiahmadi@gmail.com'
            }}
        },
        component: AdminLayout
    })

    ctx.addPage('/', {
        page: 'Dashboard'
    })
    

}