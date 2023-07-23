import { ButtonGroup } from "@ulibs/ui";
import { View } from "@ulibs/ui";
import { Row } from "@ulibs/ui";
import { Col } from "@ulibs/ui";

export function PageHeader({ title }, slots) {
    return Row({ py: "md" }, [
      Col({ col: true }, [title && View({ tag: "h3" }, title)]),
      slots && Col({ col: 0 }, ButtonGroup([slots])),
    ]);
  }
  