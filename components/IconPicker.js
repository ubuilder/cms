import { Input } from "@ulibs/ui";
import { Icon } from "@ulibs/ui";
import { Button } from "@ulibs/ui";
import { Row } from "@ulibs/ui";
import { Tooltip } from "@ulibs/ui";

export function IconPicker({ value, name }) {
    return [
      Tooltip([
        Row({ w: "6xl", mt: "xxs" }, [
          Input({ bgColor: 'base', col: true, name, w: "5xl", value }),
        ]),
      ]),
      Button(
        { type: "button", size: "lg", id: "icon-input" },
        Icon({ name }, Icon(value))
      ),
    ];
  }