import { connect } from "@ulibs/db";
import { slugify } from "./slugify.js";

export const Sites = (connect({filename: "./db/main.json"})).getModel('sites')

export async function getDb(domain) {
  const sites = await Sites.query()

  for(let site of sites.data) {
    if(site.domains.includes(domain)) {
      const filename = "db/" + slugify(site.id, "-") + ".json";

      const {getModel: table} = connect({filename})

      return table;
    }
  }

  const newSite = {
    name: 'NO Name (' + slugify(domain) + ')',
    domains: [domain]
  }

  const [site_id] = await Sites.insert(newSite)

  const filename = "db/" + slugify(site_id, "-") + ".json";

  const {getModel: table} = connect({filename})
  await initData({table});

  return table;
} 

export async function initData({table}) {
    const isBaseExists = await table('components').get({where: {id: '000'}})
    if(isBaseExists) return;
    
    await table('components').insert({
      id: "000",
      name: "Base",
      props: [
        {
          name: "template",
          type: "code",
          default_value: "<div>{{{slot}}}</div>",
        }
      ],
    });
  }
  