// src/routes/route.ts

import { type RouteConfig, index, route } from "@react-router/dev/routes";
import Paste from "./routes/paste";

export default [
    index("routes/home.tsx"),
    route("paste", "routes/paste.tsx"),
] satisfies RouteConfig;
