import { SidebarItem } from "../../../components/sidebar.js";
import { WithSidebar } from "../../../components/WithSidebar.js";

export default (props, slots) => {
  const mode = "default";

  const sidebarItems = [  
    SidebarItem({
      icon: "settings",
      title: "General",
      href: "/settings",
      mode,
    }),
    SidebarItem({
      icon: "language",
      title: "Translations",
      href: "/settings/translations",
      mode,
    }),
  ];

  return WithSidebar({ mode, sidebarItems }, slots);
};
