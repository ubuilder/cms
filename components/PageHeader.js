import { ButtonGroup } from "@ulibs/ui";
import { View } from "@ulibs/ui";
import { Row } from "@ulibs/ui";
import { Col } from "@ulibs/ui";

export function PageHeader({ title, ...rest }, slots) {
    return View({py: 'lg', ...rest}, Row({align: 'center', justify: 'end'}, [
      Col({ col: true }, [title && View({ tag: "h2", style: 'margin: 0; line-height: 100%'}, title)]),
      slots && Col({ col: 0 }, ButtonGroup({style: "overflow: initial"},[slots])),
    ]));
  }
  