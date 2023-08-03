import { Container, View } from "@ulibs/ui";
import { PageHeader } from "./PageHeader.js";

export function Page(
  { title, actions = [], container = true, ...restProps },
  slots
) {
    const header = title ? PageHeader({ title }, actions) : ''
    
  let content;
  if (container) {
    content = Container({ size: "xl", mx: "auto" }, [header, slots]);
  } else {
    content = [header, slots];
  }
  return View({ ...restProps }, content);
}
