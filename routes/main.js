import { AdminLayout } from "./main.view.js"
import path from 'path'

export default function main(ctx) {

    ctx.addStatic({path: path.resolve('./node_modules/@ulibs/ui/dist'), prefix: '/dist'})

    ctx.addLayout('/', {
        load() {
            return {
                user: {
                    name: 'hadi',
                    username: 'hadiahmadi',
                    email: 'thehadiahmadi@gmail.com'
                },
            }
        },
        component: AdminLayout
    })

    ctx.addPage('/', {
        load() {
            return {
                messages: [
                    {type: 'info', dismissible: true, content: 'Welcome to UBuilder CMS', title: 'Welcome!'}
                ]
            }

        },
        page: 'Dashboard'
    })
    

}