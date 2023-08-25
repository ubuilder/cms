// Main entry of project

import { Router } from "@ulibs/router";
import { connect } from "@ulibs/db";
import "dotenv/config";
import { rename, writeFile } from "fs/promises";
import { fileBasedRouting } from "./utils/routing.js";
import { getDb, initData } from "./utils/models.js";

export function CMS({
  dev = false,
  filename = ":memory:",
} = {}) {
  const { startServer, addPage, addLayout, addStatic, build } = Router({
    dev,
    reloadTimeout: 1000,
  });

  const db = connect({
    filename
  });

  async function resetDatabase(id) {
    const filename = `db/${id}.json`

    await rename(
      filename,
      `db/${id}-backup-${new Date().valueOf()}.json`
    );
    db.invalidate();
  }

  const ctx = {
    resetDatabase,
    startServer,
    addPage,
    addLayout,
    addStatic,
    build
  };

  return ctx;
}

const dev = !!process.env.DEV_MODE;

const ctx = CMS({ dev, filename: process.env.DB_FILENAME ?? "./db/app.json" });

ctx.addStatic({ path: "./node_modules/@ulibs/ui/dist", prefix: "/dist" });
ctx.addStatic({ path: "./", prefix: "/assets" });
ctx.addStatic({ path: "./public", prefix: "/res", opts:{'max-age': 1} });

await fileBasedRouting({
  path: "./routes",
  addPage: ctx.addPage,
  addLayout: ctx.addLayout,
  ctx,
});

ctx.startServer(process.env.PORT ?? 3043);

// ctx.build('./dist')