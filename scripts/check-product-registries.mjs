import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const productDir = path.join(root, "docs", "product");
const required = [
  "screen-registry.json",
  "action-registry.json",
  "api-registry.json",
  "permission-registry.json",
  "test-registry.json",
  "figma-route-map.md",
  "module-status.md"
];

let failed = false;

for (const file of required) {
  const filePath = path.join(productDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${file}`);
    failed = true;
    continue;
  }

  if (file.endsWith(".json")) {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.error(`${file} must be a non-empty JSON array`);
        failed = true;
      }
    } catch (error) {
      console.error(`${file} is not valid JSON: ${error.message}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("Product registry files are present and parseable.");

const routerPath = path.join(root, "frontend", "src", "app", "router.tsx");
const screenRegistryPath = path.join(productDir, "screen-registry.json");

if (fs.existsSync(routerPath)) {
  const router = fs.readFileSync(routerPath, "utf8");
  const routePaths = [...router.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((routePath) => routePath !== "*");
  const screens = JSON.parse(fs.readFileSync(screenRegistryPath, "utf8"));
  const screenRoutes = new Set(screens.map((screen) => screen.route));
  const missingRoutes = routePaths.filter((routePath) => !screenRoutes.has(routePath));

  if (missingRoutes.length > 0) {
    console.error("Routes missing from screen-registry.json:");
    for (const routePath of missingRoutes) {
      console.error(`- ${routePath}`);
    }
    process.exit(1);
  }

  console.log(`Screen registry covers ${routePaths.length} concrete router paths.`);
}
