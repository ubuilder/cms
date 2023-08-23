import { ButtonGroup, Container, View } from "@ulibs/ui";
import { PageHeader } from "./PageHeader.js";

export function Page(
  { title, actions = [], filters = [], container = true, $data, ...restProps },
  slots
) {
  const header = title ? PageHeader({ title }, actions) : "";

  let filterRow = "";

  if (filters.length > 0) {
    filterRow = ButtonGroup(
      { style: "margin-top: calc(-1 * var(--size-md));", mb: "lg" },
      [filters]
    );
  }

  const htmlHead = [View({ tag: "script", src: "/res/page/script.js" })];

  let content;
  if (container) {
    content = Container({ htmlHead, $data, size: "xl", mx: "auto" }, [
      header,
      filterRow,
      slots,
    ]);
  } else {
    content = View({ htmlHead, $data }, [header, filterRow, slots]);
  }
  return View({ "u-page": "", ...restProps }, content);
}
