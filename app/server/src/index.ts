import express from "express"
import * as trpcExpress from '@trpc/server/adapters/express'
import {appRouter} from '@trpc-crud/trpc'
import {  createOpenApiExpressMiddleware, generateOpenApiDocument } from "trpc-to-openapi";

import  swaggerUi from 'swagger-ui-express';

const app = express();

app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
    })
)
app.use(
    "/api",
    createOpenApiExpressMiddleware({
        router: appRouter
    })
)
const openApiDocs = generateOpenApiDocument(appRouter,{
    title: 'My TRPC CRUD ',
    description: '',
    version: "1.0.0",
    baseUrl: process.env.BASE_URL||"https://trpc-crud.vercel.app/api"
})

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocs)
)

// IF developemnt Server ,use this

/* app.listen(4000,()=>{
    console.log("TRPC is running")
}) */