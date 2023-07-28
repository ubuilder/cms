// Main entry of project

import { Router } from "@ulibs/router";
import { connect } from "@ulibs/db";
import pages from "./routes/pages.js";
import data from "./routes/data/index.js";
import main from "./routes/main.js";
import 'dotenv/config'
import { settings } from "./routes/settings/index.js";

export function CMS({
  dev = false,
  
  filename = ":memory:",
  client = "sqlite3",
} = {}) {
  const { startServer, addPage, addLayout, addStatic } = Router({
    dev,
    reloadTimeout: 1000,
  });
  
  const configs = {
    production: {
        client: 'mysql',
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    },
    dev: {
      client: 'sqlite3',
      filename: './app.db'
    }
  }
  
  const {
    createTable,
    removeTable,
    getModel,
    updateColumn,
    addColumns,
    removeColumns,
    renameTable,
  } = connect(configs[dev ? 'dev': 'production']);

  const ctx = {
    startServer,
    addPage,
    addLayout,
    addStatic,
    getModel,
    removeTable,
    createTable,
    updateColumn,
    addColumns,
    removeColumns,
    renameTable,
  };

  return ctx;
}

// if dev mode then create tables
const dev = !!process.env.DEV_MODE;

const ctx = CMS({ dev });

await main(ctx);
await pages(ctx);
await settings(ctx);
await data(ctx);

ctx.startServer(process.env.PORT ?? 3043);
