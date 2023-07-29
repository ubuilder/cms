import { ButtonGroup } from "@ulibs/ui";
import { View } from "@ulibs/ui";
import { Row } from "@ulibs/ui";
import { Col } from "@ulibs/ui";

export function PageHeader({ title }, slots) {
    return View({py: 'lg'}, Row({align: 'center'}, [
      Col({ col: true }, [title && View({ tag: "h2" }, title)]),
      slots && Col({ col: 0 }, ButtonGroup([slots])),
    ]));
  }
  