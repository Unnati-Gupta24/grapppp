import express from "express";
import http from "http";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import mergedResolvers from "./resolvers/index";
import mergedTypeDefs from "./typeDefs/index";

import { connectDB } from "./db/connectDB";

dotenv.config();

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
    })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀  Server ready at https://localhost:4000/`);