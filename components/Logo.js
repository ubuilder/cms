import { View } from "@ulibs/ui"

export function Logo({mode = 'icon-only'}) {

    if(mode == 'icon-only') {
        return View({tag: 'a', href: '/', p:'sm', d: 'flex', align: 'center', justify: 'center', textColor: 'primary'}, "UB")
    } else {
        return View(
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
          )
    }
}