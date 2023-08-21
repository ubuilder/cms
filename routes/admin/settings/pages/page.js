import { Button, Col, Icon, Row, Select } from "@ulibs/ui";
import { Page } from "../../../../components/Page.js";
import { Sites } from "../../../../utils/models.js";

export async function load({ ctx, headers }) {
  const sites = await Sites.query();

  let theSite;
  for (let site of sites.data) {
    if (site.domains.includes(headers.host)) {
      theSite = site;
    }
  }

  if (theSite) {
    return {
      pages: await ctx
        .table("pages")
        .query()
        .then((res) => res.data),
      default_page_id: theSite.default_page_id,
    };
  }
  return {
    pages: await ctx
      .table("pages")
      .query()
      .then((res) => res.data),
    default_page_id: undefined,
  };
}

export async function save({ ctx, headers, body }) {
  const sites = await Sites.query();

  let theSite;
  for (let site of sites.data) {
    if (site.domains.includes(headers.host)) {
      theSite = site;
    }
  }

  await Sites.update(theSite.id, {
    default_page_id: body.default_page_id,
  });

  return {
    body: {
      success: true,
    },
  };
}

export default ({ pages, default_page_id }) => {
  return Page(
    {
      title: "Page Settings",
      $data: { default_page_id: default_page_id ?? '' },
      actions: [
        // Button({ color: "primary" }, [
        //   Icon({ name: "plus" }),
        //   "Add New Language",
        // ]),
      ],
    },
    [
      Row({ align: "end" }, [
        Select({
            col: true,
            placeholder: 'Choose a Page as Homepage',
          label: "Default Page",
          items: pages,
          key: "id",
          text: "title",
          name: "default_page_id",
        }),
        Col({col: 0}, [Button({ onClick: '$post("?save", {default_page_id}).then(res => location.reload())', color: "primary" }, "Save")]),
      ]),
    ]
  );
};
