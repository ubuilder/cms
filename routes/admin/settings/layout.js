import { SidebarItem } from "../../../components/sidebar.js";
import { WithSidebar } from "../../../components/WithSidebar.js";

export default (props, slots) => {
  const mode = "default";

  const sidebarItems = [  
    SidebarItem({
      icon: "settings",
      title: "General",
      href: "/admin/settings",
      mode,
    }),
    SidebarItem({
      icon: "language",
      title: "Translations",
      href: "/admin/settings/translations",
      mode,
    }),
    SidebarItem({
      icon: "file",
      title: "Pages",
      href: "/admin/settings/pages",
      mode,
    }),
  ];

  return WithSidebar({ mode, sidebarItems }, slots);
};
