import { Input } from "@ulibs/ui";
import { Icon } from "@ulibs/ui";
import { Button } from "@ulibs/ui";
import { Row } from "@ulibs/ui";
import { Popover } from "@ulibs/ui";

export function IconPicker({ value, name }) {
  return [
    Button({ type: "button", id: "icon-input" }, [
      Icon({ $name: name, name: value }),
      Popover({trigger: 'hover', p: 'xs'}, [
        Row({ w: "6xl", m: 0}, [
          Input({ col: true, name, value }),
        ]),
      ]),
    ]),
  ];
}
