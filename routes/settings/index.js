import { Button, FormField, Icon } from "@ulibs/ui"
import { MainLayout } from "../../components/MainLayout.js"
import { PageHeader } from "../../components/PageHeader.js"
import { SidebarItem } from "../../components/sidebar.js"

export function settings(ctx) {

    ctx.addLayout('/admin/settings', {
        component: (props, slots) => {
            const mode = 'default'

            const sidebarItems = [
                SidebarItem({icon: 'settings', title: 'General', href: '/settings', mode }),
                SidebarItem({icon: 'language', title: 'Translations', href: '/settings/translations', mode}),
            ]
            
            return MainLayout({mode, sidebarItems}, slots)
        }
    }   )
    

    ctx.addPage('/admin/settings', {
        page: () => {
            return [
                PageHeader({title: "General Settings"}),
                FormField({label: "Reset Database", description: 'You should restart server to take effect'},[
                    Button({color: 'error', onClick: `$post('?reset-db')`}, "Reset")
                ])
            ]
        }
    })

    ctx.addPage('/admin/settings/translations', {
        page: () => {
            return [
                PageHeader({title: "Translations"}, [
                    Button({color: 'primary'}, [
                        Icon({name: 'plus'}),
                        "Add New Language"
                    ])
                ])
            ]
        }
    })

    ctx.addPage('/admin/settings/reset', {
        actions: {
            async 'reset-db'() {
                await ctx.resetDatabase()
                return {
                    body: {
                        message: 'Database successfully resetted!'
                    }
                }
            }
        },
        page: () => {
            return [
                PageHeader({title: "Reset Database"}),
            ]
        }
    })
}