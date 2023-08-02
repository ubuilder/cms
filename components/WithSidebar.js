import { Container, View } from "@ulibs/ui";
import { Sidebar } from "./sidebar.js";

export function WithSidebar({ mode, sidebarItems }, $slots) {
  if(!mode) {
    return Container({size: 'xl', mx: 'auto'}, $slots)
  }

    return View(
      {
        style: "position: relative",
      },
      [
        Sidebar({ mode, d: "none", dMd: "block" }, [
          View({ style: "overflow-y: auto; height: 100%;" }, [sidebarItems]),
        ]),
        View(
          {
            "u-content": "",
            "u-content-sidebar-mode": mode,
            style: "height: calc(100vh - 64px); overflow-y: auto",
          },
          $slots
        ),
      ]
    );
  }
  