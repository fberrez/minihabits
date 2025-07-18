import { generate } from "openapi-typescript-codegen";
import * as path from "path";

// URL to your OpenAPI specification
const OPENAPI_URL = "http://localhost:3000/api-json";

async function generateApiClient() {
  try {
    // eslint-disable-next-line no-console
    console.log(`Fetching OpenAPI specification from ${OPENAPI_URL}...`);

    // Generate the API client directly from the URL
    await generate({
      input: OPENAPI_URL,
      output: path.resolve(process.cwd(), "src/api/generated"),
      httpClient: "fetch",
      useOptions: true,
      useUnionTypes: true,
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: false,
    });

    // eslint-disable-next-line no-console
    console.log("API client generated successfully!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating API client:", error);
    process.exit(1);
  }
}

generateApiClient();
