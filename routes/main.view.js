import {
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Row,
  Col,
  Card,
  CardBody,
  View,
  Container,
  Icon,
  ButtonGroup,
  Input,
  Tooltip,
} from "@ulibs/ui";
import { Sidebar, SidebarItem } from "../components/sidebar.js";

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
        View({
          tag: "link",
          rel: "stylesheet",
          href: "https://unpkg.com/@ulibs/ui@next/dist/styles.css",
        }),

        View({
          tag: "script",
          src: "https://unpkg.com/@ulibs/ui@next/dist/ulibs.js",
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
  
            })
            `
        ),
      ],
    },
    [
      Sidebar({ mode }, ({ mode }) => [
        View(
          {
            py: "md",
            px: "sm",
            textColor: "primary",
            borderColor: "primary",
            style:
              "font-size: 20px; line-height: 34px; font-weight: bold; background-color: #0160ef1a;",
          },
          [
            "U",
            View(
              {
                tag: "span",
                textColor: "success",
                style:
                  "font-size: 28px; height: 32px; font-weight: bold; margin-left: -4px; padding-bottom: 4px; margin-right: -4px",
              },
              "B"
            ),
            View({ tag: "span", style: "font-size: 16px" }, "UILDER"),
          ]
        ),
        SidebarItem({ mode, title: "Home", icon: "dashboard", href: "/" }),
        SidebarItem({ mode, title: "Pages", icon: "file", href: "/pages" }),
        SidebarItem({ mode, title: "Data", icon: "database", href: "/data" }),
        SidebarItem({ mode, title: "Assets", icon: "photo", href: "/assets" }),
        SidebarItem({
          mode,
          title: "Market",
          icon: "building-store",
          href: "/market",
        }),
        SidebarItem({
          mode,
          title: "Settings",
          mt: "auto",
          icon: "settings",
          href: "/settings",
        }),
      ]),
      View({ "u-content": true, "u-content-sidebar-mode": mode }, [
        Header($props, [
          // check if is logged in from props

          Col({ dSm: "none", col: 0 }, Icon("menu-2")),
          Input({
            col: 0,
            d: "none",
            dSm: "block",
            style: "margin-bottom: 0;",
            placeholder: "Search",
          }),
          Col({ col: true }),
          Col({ class: "hide-light" }, [
            Icon(
              {
                onClick:
                  "el => document.body.setAttribute('u-view-theme', 'light')",
              },
              "sun"
            ),
          ]),
          Col({ class: "hide-dark" }, [
            Icon(
              {
                onClick:
                  "el => document.body.setAttribute('u-view-theme', 'dark')",
              },
              "moon"
            ),
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
      ]),
    ]
  );
}