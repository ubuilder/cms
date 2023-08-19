import recursiveReadDir from "recursive-readdir";
import { sep } from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { View } from "@ulibs/ui";
import { getDb  } from "./models.js";

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
    const slug = file
      .replace("routes", "")
      .replace("page.js", "")
      .replace("layout.js", "");

    let sections = slug.split("/");

    sections = sections.map((section) => {
      if (section.startsWith("[...") && section.endsWith("]")) {
        return "*";
      } else if (section.startsWith("[") && section.endsWith("]")) {
        return ":" + section.substring(1, section.length - 1);
      }
      return section;
    });

    return sections.join("/");
  }
  async function loadModule(file, ctx) {
    const module = await import("../" + file);
    const result = {};

    const { load, default: page, ...actions } = module;

    if (load) {
      result.load = async function (req, ...args) {
        ctx.table = await getDb(req.headers.host)

        return await load({ ctx, ...req }, ...args);
      };
    }

    result.actions = {};
    for (let action in actions) {
      result.actions[action] = async function (req, ...args) {
        ctx.table = await getDb(req.headers.host)

        return await actions[action]({ ctx, ...req }, ...args);
      };
    }

    if (file.endsWith("page.js")) {
      result.type = "page";

      if (existsSync(file.replace("page.js", "script.js"))) {
        result.script = await readFile(
          file.replace("page.js", "script.js"),
          "utf-8"
        );
      }
      if (existsSync(file.replace("page.js", "style.css"))) {
        result.style = await readFile(
          file.replace("page.js", "style.css"),
          "utf-8"
        );
      }

      if (page) {
        result.page = (props) => {
          if (typeof page !== "function") return page;

          const content = page(props);
        
          if (typeof content === "string") {
            return content;
          }

          if (!content) return content;

          return View(
            {
              d: "contents",
              htmlHead: [result.style ? `<style>${result.style}</style>` : ""],
            },
            [
              content,
              result.script ? `<script>${result.script}</script>` : "",
              result.style
                ? View({ htmlHead: [`<style>${result.style}</style>`] })
                : "",
            ]
          );
        };
      }
    } else {
      result.page = page;
      result.type = "layout";
    }

    return result;
  }

  for (let file of files) {
    file = file.split(sep).join("/");
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
