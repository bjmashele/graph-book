/* eslint-disable quotes */
import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import compress from "compression";

import services from "./services";

const app = express();
const PORT = 8080;
const root = path.join(__dirname, "../..");
const serviceNames = Object.keys(services);

// eslint-disable-next-line no-plusplus
for (let j = 0; j < serviceNames.length; j += 1) {
  const name = serviceNames[j];
  if (name === "graphql") {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}

if (process.env.NODE_ENV === "development") {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.amazonaws.com"]
      }
    })
  );
  app.use(compress());
  app.use(cors());
}

app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use("/", express.static(path.join(root, "dist/client")));
app.use("/uploads", express.static(path.join(root, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "/dist/client/index.html"));
});

app.get("/", (req, res) => res.send("Hello graphbook"));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
