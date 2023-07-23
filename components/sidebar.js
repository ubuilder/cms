import { Icon, Tooltip, View } from "@ulibs/ui";

const styles = `
       
[u-sidebar] {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-right: 1px solid var(--color-base-400);
    background-color: var(--color-base-200);
}

[u-view-theme="dark"] [u-sidebar] {
    background-color: var(--color-base-200);
}
[u-content-sidebar-mode="icon-only"] {
    margin-left: 48px;
}

[u-content-sidebar-mode="default"] {
  margin-left: 48px;
}
[u-content-sidebar-mode="compact"] {
  margin-left: 48px;
}

[u-sidebar-mode="default"] {
  width: 48px;
}
[u-sidebar-mode="compact"] {
  width: 48px;
}
[u-sidebar-mode="icon-only"] {
  width: 48px;
}

[u-sidebar-mode="default"] [u-sidebar-item-text] {
  display: none;
}
[u-sidebar-mode="compact"] [u-sidebar-item-text] {
  display: none;
}

@media (min-width: 768px) {
    [u-sidebar-mode="default"] [u-sidebar-item-tooltip] {
      display: none!important;
    }
    [u-sidebar-mode="compact"] [u-sidebar-item-tooltip] {
      display: none!important;
    }

    [u-content-sidebar-mode="default"] {
      margin-left: 240px;
    }
    [u-content-sidebar-mode="compact"] {
      margin-left: 130px;
    }

    [u-sidebar-mode="default"] [u-sidebar-item-text] {
      display: block;
    }  
    [u-sidebar-mode="compact"] [u-sidebar-item-text] {
      display: block;
    }  
    [u-sidebar-mode="default"] [u-sidebar-item-icon] {
      --icon-size: var(--size-md);
    }
    [u-sidebar-mode="default"] [u-sidebar-item] {
      padding: var(--size-xs) var(--size-sm);

      flex-direction: row;
      align-items: center;              
      justify-content: start;
    }
    [u-sidebar-mode="compact"] [u-sidebar-item-icon] {
      --icon-size: var(--size-lg);
    }
    
    [u-sidebar-mode="compact"] [u-sidebar-item] {
      flex-direction: column;
      padding: var(--size-sm);

      align-items: center;
      justify-content: center;
      
    }


    [u-sidebar-mode="default"] {
      width: 240px;
    }
    [u-sidebar-mode="compact"] {
      width: 130px;
    }
}

[u-sidebar-item] {
    display: flex;
    gap: var(--size-xs);
    text-decoration: none;
    color: var(--color-base-800);
    padding: var(--size-xs) var(--size-xxs);

    padding: var(--size-xs) var(--size-xxs);

    align-items: center;
    justify-content: center;

   }



  [u-sidebar-item-icon] {

    --icon-size: var(--size-sm);            
  }
   
  [u-sidebar-mode="icon-only"] [u-sidebar-item-text] {
    display: none;
  }  

  [u-sidebar-item]:hover {
    background-color: var(--color-base-300);
  }

`

export function SidebarItem({ mode = 'compact', href, title, icon, ...restProps } = {}, $slots) {
    return View(
      {
        ...restProps,
        tag: "li",
        style: "list-style-type: none",
      },
      View(
        {
          tag: "a",
          "u-sidebar-item": true,
          href,
        },
        [
          Icon({ 'u-sidebar-item-icon': ''}, icon),
          Tooltip({'u-sidebar-item-tooltip': '', placement: 'right'}, title),
          View(
            {
              'u-sidebar-item-text': '',
              d: "inline-block",
            },
            title
          ),
        ]
      )
    );
  }
  
  export function Sidebar($props, $slots) {
    return View(
      {

        htmlHead: `<style>${styles}</style>`,
        "u-sidebar": true,
        tag: "ul",
        d: "flex",
        flexDirection: "column",
        h: 100,
        style: "padding-left: 0",
        'u-sidebar-mode': $props.mode 
      },
      $slots({mode: $props.mode})
    );
  }
  