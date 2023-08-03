import recursiveReadDir from "recursive-readdir";
import { resolve } from "path";

export async function fileBasedRouting({
  path,
  addPage,
  addLayout,
  ctx = {},
} = {}) {
  if (!path) throw new Error("[fileBasedRouting] path is not defined");
  if (!addPage) throw new Error("[fileBasedRouting] addPage is not defined");
  if (!addLayout)
    throw new Error("[fileBasedRouting] addLayout is not defined");

  const files = await recursiveReadDir(path);

  function getSlug(file) {
    const slug = file.replace('routes', '').replace("page.js", "").replace("layout.js", "");

    let sections = slug.split("/");

    sections = sections.map((section) => {
      if (section.startsWith("[...") && section.endsWith("]")) {
        return "*";
      } else if (section.startsWith("[") && section.endsWith("]")) {
        return ":" + section.substring(1, section.length - 1);
      }
      return section;
    });

    return sections.join('/');
  }
  async function loadModule(file, ctx) {
    const module = await import("../" + file);

    const { load, default: page, ...actions } = module;

    let resultActions = {}
    for (let action in actions) {
      resultActions[action] = (req, ...args) => actions[action]({ ctx, ...req }, ...args);
    }

    return {
      actions: resultActions,
      load: load ? (req, ...args) => load({ ctx, ...req }, ...args) : undefined,
      page,
      type: file.endsWith("page.js") ? "page" : "layout",
    };
  }

  for (let file of files) {
    if (file.endsWith("page.js") || file.endsWith("layout.js")) {
      const { actions, load, page, type } = await loadModule(file, ctx);
      const slug = getSlug(file);

      if (type === "page") {
        addPage(slug, { actions, load, page });
      } else {

        addLayout(slug, { actions, load, component: page });
      }
    }
  }
}
