import { Page } from "../../../../components/Page.js";

export default () => {
  return Page({
    title: "Translations",
    actions: [
      Button({ color: "primary" }, [
        Icon({ name: "plus" }),
        "Add New Language",
      ]),
    ],
  });
};
