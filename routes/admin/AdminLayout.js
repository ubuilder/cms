import {
  Button,
  Avatar,
  Alert,
  Row,
  Col,
  View,
  AlertContainer,
  Icon,
  Input,
} from "@ulibs/ui";
import { Sidebar, SidebarItem } from "../../components/sidebar.js";
import { Logo } from "../../components/Logo.js";

export function Header($props, $slots) {
  return View(
    {
      "u-header": true,
      py: "xs",
      bgColor: "base",
      d: "flex",
      align: "center",
      style: "border-bottom: 1px solid var(--color-base-400);",
    },
    [
      Row(
        {
          w: 100,
          px: "sm",
          align: "center",
        },
        $slots
      ),
    ]
  );
}

export function Body($props, $slots) {
  return View([$slots]);
  // return $props.user
  // ? $slots
  // : Card({ mt: "md" }, [CardBody("You are not logged in!")]);
}

export function AdminLayout($props, $slots) {
  const mode = "icon-only";
  return View(
    {
      htmlHead: [
        `<meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">`,
          `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.30.0/tabler-icons.min.css">`,
        View({
          tag: "link",
          rel: "stylesheet",
          href: "/dist/styles.css",
        }),

        View({
          tag: "script",
          src: "/dist/ulibs.js",
          // defer: true,
          // async: true,
        }),
        View(
          { tag: "style" },
          `           
              [u-header] {
                  background-color: var(--color-base-200);
                  height: 64px;
              }
  
              [u-header] [u-input] {
                height: 38px;
              }
              
      
              [u-col]{
                  align-self: initial !important;
              }
    
                 
             
              [u-view-theme="dark"] .hide-dark {
                  display: none;
              }
      
          
              [u-view-theme="dark"] .hide-light {
                  display: flex;
              }
              .hide-light {
                  display: none;
              }
              
              `
        ),
        View(
          { tag: "script" },
          `
              document.addEventListener('alpine:init', () => {

                  Alpine.directive('data-table', (el) => {
                      Alpine.bind(el, {
                          'u-data'() {
                              return {
                                  sort: undefined
                              }
                          }
                      })
                  })
      
                  Alpine.magic('table', (el) => {
                      return {
                          sort(key) {
                              if(this.$data.sort === key) {
                                  this.$data.sort = '-' + key
                              } else {
                                  this.$data.sort = key
                              }
                          },
                          get params() {
                              return \`?sort=\${this.$data.sort ?? ''}\`
                          }
                      }
                  })

                  window.Alpine.magic('upload', (el) => {
                      console.log('el', el)
                      el = el.querySelector('input')
                      const formData = new FormData()
                      formData.append('file', el.files[0])
                      fetch('?upload', {
                        method: 'POST',
                        body: formData
                      }).then(res=> console.log('response', res))

                      
                  });
    
              })
              `
        ),
      ],
    },
    [
      Sidebar({ mode }, ({ mode }) => [
        Logo({ mode }),
        SidebarItem({ mode, title: "Home", icon: "dashboard", href: "/" }),
        SidebarItem({
          mode,
          title: "Pages",
          icon: "file",
          href: "/admin/pages",
        }),
        SidebarItem({
          mode,
          title: "Data",
          icon: "database",
          href: "/admin/data",
        }),
        SidebarItem({
          mode,
          title: "Assets",
          icon: "photo",
          href: "/admin/assets",
        }),
        SidebarItem({
          mode,
          title: "Market",
          icon: "building-store",
          href: "/admin/market",
        }),
        SidebarItem({
          mode,
          title: "Settings",
          mt: "auto",
          icon: "settings",
          href: "/admin/settings",
        }),
      ]),
      View({ "u-content": true, "u-content-sidebar-mode": mode }, [
        Header($props, [
          // check if is logged in from props

          Col({ dSm: "none", col: 0 }, Icon({ name: "menu-2" })),
          Input({
            col: 4,
            d: "none",
            dSm: "block",
            style: "margin-bottom: 0;",
            placeholder: "Search",
          }),
          Col({ col: true }),
          Col({ class: "hide-light" }, [
            Icon({
              name: "sun",
              onClick:
                "el => document.body.setAttribute('u-view-theme', 'light')",
            }),
          ]),
          Col({ class: "hide-dark" }, [
            Icon({
              name: "moon",
              onClick:
                "el => document.body.setAttribute('u-view-theme', 'dark')",
            }),
          ]),
          $props.user
            ? [
                Col([
                  Avatar({ color: "info" }, $props.user.name.substring(0, 2)),
                ]),
                // Form(
                //   { action: "logout" },
                //   Col([Button({ color: "error" }, "Logout")])
                // ),
              ]
            : Col([Button({ href: "/login" }, "Login")]),
        ]),
        Body($props, $slots),
        AlertContainer(
          { placement: "bottom-end", name: "alerts" },
          $props.messages?.map(
            ({
              content,
              dismissible = true,
              type = "success",
              autoClose = true,
              ...props
            }) => Alert({ type, autoClose, dismissible, ...props }, content)
          )
        ),
      ]),
    ]
  );
}
