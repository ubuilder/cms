import { Button, Icon } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";

export default () => {
  return Page(
    {
      title: "Layouts",
      actions: [
        Button({ href: "/admin/pages" }, [
          Icon({ name: "chevron-left" }),
          "Back",
        ]),
        Button({ color: "primary" }, [Icon({ name: "plus" }), "Add Layout"]),
      ],
    },
    ["Layout list"]
  );
};
