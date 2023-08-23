import { Button, Icon, Input, Popover, RadioGroup, View } from "@ulibs/ui";

export function Filter({
  type = "select",
  items = [
    { text: "Image", key: "image" },
    { text: "Audio", key: "audio" },
    { text: "Video", key: "video" },
  ],
  text = "Type",
  key = "type",
} = {}) {
  const allItems = [{ text: "All", key: "" }, ...items];
  if (type === "text") {
    return View(
      {
        $data: { items: allItems },
        $init: `if(!filters.${key}) filters.${key} = {value: "", operator: "="}`,
      },
      [
        Button(
          {
            gap: 0,
            
            style: "border-radius: var(--size-2xl); height: var(--size-lg)",
            $borderColor: `filters.${key}.value !== '' ? "primary-500" : ""`,
            $bgColor: `filters.${key}.value !== '' ? "primary-100" : ""`,
            $textColor: `filters.${key}.value !== '' ? "primary-500" : ""`,
          },
          [
            View([
              View({ tag: "span" }, text + ": "),

              View({
                tag: "span",
                $html: `filters.${key}.value !== '' ? ('<b>' + filters.${key}.value + '</b>') : 'All'`,
              }),
            ]),
            View(
              {
                $if: `filters.${key}.value`,
                style: "margin-right: calc(var(--size-md) * -1)",
                p: "xs",
                onClick: `$event.stopPropagation(); filters.${key}.value = ''; reload()`,
              },
              Icon({ name: "x" })
            ),
          ]
        ),
        Popover({ placement: "bottom-start" }, [
          View({ p: "sm" }, [
            RadioGroup({
              label: "Mode",
              items: [
                { key: "like", text: "Like" },
                { key: "=", text: "Equal" },
                { key: "!=", text: "Not Equal" },
              ],
              name: `filters.${key}.operator`,
              key: "key",
              text: "text",
            }),
            Input({
              label: "Text",
              name: "filters." + key + ".value",
              onChange: "reload()",
              onBlur: "reload()",
            }),
          ]),
        ]),
      ]
    );
  }
  return View(
    {
      $data: { items: allItems },
      $init: `if(!filters.${key}) filters.${key} = {value: "", operator: '='}`,
    },
    [
      Button(
        {
          gap: 0,
          style: "border-radius: var(--size-2xl); height: var(--size-lg)",
          $borderColor: `filters.${key}.value !== '' ? "primary-500" : ""`,
          $bgColor: `filters.${key}.value !== '' ? "primary-100" : ""`,
          $textColor: `filters.${key}.value !== '' ? "primary-500" : ""`,
        },
        [
          View([
            View({ tag: "span" }, text + ": "),

            View({
              tag: "span",
              $html: `filters.${key}.value !== '' ? ('<b>' + (items.find(x => x.key === filters.${key}.value) ?? {}).text + '</b>') : 'All'`,
            }),
          ]),
          View(
            {
              $if: `filters.${key}.value`,
              style: "margin-right: calc(var(--size-md) * -1)",
              p: "xs",
              onClick: `$event.stopPropagation(); filters.${key}.value = ''; reload()`,
            },
            Icon({ name: "x" })
          ),
        ]
      ),

      Popover({ placement: "bottom-start", p: "sm" }, [
        View({ $for: "item in items" }, [
          View({
            style: "cursor: pointer",
            px: "sm",
            py: "xs",
            tag: "div",
            $text: "item.text",
            onClick: `filters.${key}.value = item.key; reload()`,
          }),
        ]),
      ]),
    ]
  );
}
