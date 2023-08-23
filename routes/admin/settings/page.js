import { Button, Col, FormField, Icon, Input, Row } from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { Sites } from "../../../utils/models.js";

async function getSite(domain) {
  const sites = await Sites.query();
  for (let x of sites.data) {
    if (x.domains.includes(domain)) {
      return x;
    }
  }
  return null;
}

export async function load({ headers }) {
  const domain = headers.host;

  const site = await getSite(domain);

  return {
    site,
  };
}

export async function save({ headers, body }) {
  const domain = headers.host;

  const site = await getSite(domain);

  await Sites.update(site.id, {
    name: body.name,
    domains: body.domains,
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function reset_db({ headers, ctx }) {
  const site = await getSite(headers.host)

  await ctx.resetDatabase(site.id);
  return {
    body: {
      message: "Database successfully resetted!",
    },
  };
}

export default ({ site }) => {
  return Page({ $data: {site}, title: "General Settings" }, [
    Row([
      FormField({label: "Site Name"}, [
        Row({justify: 'end'}, [
          Input({col: true, name: 'site.name'}),
          Col([
            Button({onClick: '$post("?save", site)'}, 'Update')

          ])
        ])
      ]),
      FormField(
        {
          $data: { domains: site.domains, new_name: "" },
          label: "Domains",
        },
        [
          Row({ $for: "domain, index in site.domains" }, [
            Input({
              col: true,
              readonly: true,
              name: "domain",
              placeholder: "some.domain.com",
            }),
            Col(
              { col: 0 },
              Button(
                { $disabled: 'window.location.host === domain', onClick: "site.domains.splice(index, 1);$post('?save', site).then(res => $page.reload())", color: "error" },
                Icon({ name: "x" })
              )
            ),
          ]),

          Row({ justify: "end", mt: "sm" }, [
            Input({
              col: true,
              placeholder: "some.domain.com",
              name: "new_name",
            }),
            Col(
              {},
              Button(
                {
                  onClick:
                    "site.domains = [...site.domains, new_name]; $post('?save', site).then(res => $page.reload())",
                },
                [Icon({ name: "plus" }), "Add Domain"]
              )
            ),
          ]),
        ]
      ),
      FormField(
        {
          mt: 'md',
          label: "Reset Database",
          description: "This action will remove everything from database",
        },
        [Button({ color: "error", onClick: `$post('?reset_db')` }, "Reset")]
      ),
    ]),
  ]);
};
