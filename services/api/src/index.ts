/**
 * Main codebase for the ShadowCMS Node and
 * GraphQL API
 *
 * @author ShadowCMS
 */

import "reflect-metadata";
import * as ASP from "apollo-server-core";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import logger from "./util/logger";
import dayjs from "dayjs";
import cookieParser from "cookie-parser";
import ConnectPostgres from "./services/ConnectPostgres";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserRolver } from "./resolver/UserResolver";
import { RefreshTokenController } from "./controller/RefreshTokenController";
import { ArticleResolver } from "./resolver/ArticleResolver";

dotenv.config();

/* Function to launch the ShadowCMS API */
const LAUNCH = async () => {
  /**
   * Initialize new Express app environment
   */
  const api = express();
  const PORT = process.env.PORT || 5000;
  const newDate = dayjs().format("MMMM, D, YYYY HH:mm:ss");
  const whitelist = ["http://localhost:5000", "http://localhost:3000"];
  const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
      if (whitelist.includes(origin)) return callback(null, true);

      callback(new Error("Not allowed by CORS"));
    },
  };
  await api.use(cors()); /* CORS Middleware */

  /**
   * Connect to PostgreSQL Database
   */
  await ConnectPostgres();

  /**
   * Initialization and configuration for new
   * Apollo Server Express
   */
  const apolloServer = new ApolloServer({
    introspection: true,
    schema: await buildSchema({
      resolvers: [UserRolver, ArticleResolver],
    }),

    /**
     * Pass in express request and response objects
     * to ApolloServer context
     */
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      /**
       * Disable the new Apollo landing page, keep the
       * GraphQL Playground running instead.
       */
      ASP.ApolloServerPluginLandingPageDisabled,
      ASP.ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  /**
   * Start the Apollo Server
   */
  await apolloServer.start();

  /**
   * Integrate Apollo Server with Express,
   * and initialize other API middlewares
   */
  api.use(cookieParser()); /* Cookie Parser Middleware */
  apolloServer.applyMiddleware({ app: api, path: "/graphql" });

  /* Default API Route */
  api.get("/", (_, res) => {
    res.send("Hello World!");

    logger.info(`Client accessed default API route on ${newDate}`);
  });

  /* Sending Refresh Tokens */
  api.post("/refresh_token", RefreshTokenController);

  /**
   * Initialize API
   */
  api.listen(PORT, () => {
    logger.info(`🟢 ShadowCMS API restarted on ${newDate}. Current Port: ${PORT}`);
  });
};

/* Start API */
LAUNCH().catch((err) => {
  logger.error(`🚨 Error while trying to launch ShadowCMS API. Details: ${err}`);
});
