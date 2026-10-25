const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.resolve(root, "..", "hello-api");
const failures = [];

const required = [
  "README.md", "CODEOWNERS", "docs/ARCHITECTURE.md",
  "docs/DISASTER-RECOVERY.md", "docs/OPERATIONS.md", "docs/SECRETS.md",
  "namespaces/default/projects/hello-world-demo/project.yaml"
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`missing required file: ${file}`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const yamlFiles = walk(root).filter((file) => /\.ya?ml$/i.test(file));
const documents = [];
for (const file of yamlFiles) {
  try {
    for (const doc of YAML.parseAllDocuments(fs.readFileSync(file, "utf8"))) {
      if (doc.errors.length) throw new Error(doc.errors.map(String).join("; "));
      const value = doc.toJS();
      if (value) documents.push({ file, value });
    }
  } catch (error) {
    failures.push(`invalid YAML ${path.relative(root, file)}: ${error.message}`);
  }
}

const byKind = (kind) => documents.filter(({ value }) => value.kind === kind);
const names = (kind) => new Set(byKind(kind).map(({ value }) => value.metadata?.name));
const expectNames = (kind, expected) => {
  const actual = names(kind);
  for (const name of expected) if (!actual.has(name)) failures.push(`missing ${kind}/${name}`);
};

expectNames("Project", ["hello-world-demo"]);
expectNames("Component", ["hello-api", "user-service", "order-service", "notification-service"]);
expectNames("Resource", ["users-db", "orders-db", "event-broker"]);
expectNames("ResourceReleaseBinding", ["users-db-development", "orders-db-development", "event-broker-development"]);
expectNames("Environment", ["development"]);
expectNames("Workflow", ["docker-gitops-release"]);
expectNames("ClusterResourceType", ["postgres", "nats"]);

for (const { file, value } of byKind("Component")) {
  if (value.spec?.owner?.projectName !== "hello-world-demo") failures.push(`bad owner: ${file}`);
  if (value.spec?.workflow?.name !== "docker-gitops-release") failures.push(`bad workflow: ${file}`);
  const appPath = value.spec?.workflow?.parameters?.repository?.appPath;
  const localPath = appPath === "/" ? sourceRoot : path.join(sourceRoot, appPath.replace(/^\//, ""));
  for (const child of ["Dockerfile", "package.json", "workload.yaml"]) {
    if (!fs.existsSync(path.join(localPath, child))) failures.push(`missing source ${appPath}/${child}`);
  }
}

const secretPattern = /(password|token|clientSecret|privateKey)$/i;
function scan(value, trail, file) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const next = [...trail, key];
    if (secretPattern.test(key) && typeof child === "string" && child && !child.includes("${") && !child.includes("{{")) {
      failures.push(`possible plaintext secret ${path.relative(root, file)}:${next.join(".")}`);
    }
    scan(child, next, file);
  }
}
for (const { file, value } of documents) scan(value, [], file);

const workloadPaths = [
  ["hello-api", "workload.yaml"],
  ["user-service", "services/user-service/workload.yaml"],
  ["order-service", "services/order-service/workload.yaml"],
  ["notification-service", "services/notification-service/workload.yaml"]
];
for (const [name, rel] of workloadPaths) {
  const descriptor = YAML.parse(fs.readFileSync(path.join(sourceRoot, rel), "utf8"));
  if (descriptor.metadata?.name !== name) failures.push(`descriptor name mismatch: ${rel}`);
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`PASS: parsed ${yamlFiles.length} YAML files and validated OpenChoreo references without reading secret values.`);
