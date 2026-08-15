export default {
  "task-manager-client/**/*.{ts,tsx}": (filenames) => {
    const filesList = filenames.join(" ");
    const relativeFiles = filenames.map((f) => f.replace(/^.*?task-manager-client\//, ""));
    const coverageIncludes = relativeFiles
      .filter((f) => !f.includes(".test.") && !f.includes(".d.ts"))
      .map((f) => `--coverage.include="${f}"`)
      .join(" ");

    const testCmd = coverageIncludes
      ? `pnpm --dir task-manager-client exec vitest related --run --coverage --coverage.all=false ${coverageIncludes} --passWithNoTests ${filesList}`
      : `pnpm --dir task-manager-client exec vitest related --run --passWithNoTests ${filesList}`;

    return [
      `pnpm --dir task-manager-client exec prettier --write ${filesList}`,
      `pnpm --dir task-manager-client exec oxlint ${filesList}`,
      testCmd,
    ];
  },
  "task-manager-client/**/*.{json,css,html,md}": (filenames) => {
    return [
      `pnpm --dir task-manager-client exec prettier --write ${filenames.join(" ")}`,
    ];
  },
  "task-manager/src/**/*.java": () => {
    return [
      `bash -c "cd task-manager && ./mvnw test"`,
    ];
  },
};
