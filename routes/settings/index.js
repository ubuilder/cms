import { Button, Icon } from "@ulibs/ui"
import { MainLayout } from "../../components/MainLayout.js"
import { PageHeader } from "../../components/PageHeader.js"
import { SidebarItem } from "../../components/sidebar.js"

export function settings(ctx) {

    ctx.addLayout('/settings', {
        component: (props, slots) => {
            const mode = 'default'

            const sidebarItems = [
                SidebarItem({icon: 'settings', title: 'General', href: '/settings', mode }),
                SidebarItem({icon: 'language', title: 'Translations', href: '/settings/translations', mode}),
            ]
            
            return MainLayout({mode, sidebarItems}, slots)
        }
    }   )
    

    ctx.addPage('/settings', {
        page: () => {
            return [
                PageHeader({title: "General Settings"})
            ]
        }
    })

    ctx.addPage('/settings/translations', {
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

}