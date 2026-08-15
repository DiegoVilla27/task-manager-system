export default {
  "task-manager-client/**/*.{ts,tsx}": (filenames) => {
    const filesList = filenames.join(" ");

    // Normalización de rutas para compatibilidad entre Windows, Linux y macOS
    const normalizedFiles = filenames.map((f) => f.replace(/\\/g, "/"));
    const relativeFiles = normalizedFiles.map((f) =>
      f.replace(/^.*?task-manager-client\//, "")
    );

    // Patrones de archivos que no requieren tests unitarios obligatorios
    const nonTestablePatterns = [
      /\.test\./,
      /\.d\.ts$/,
      /\/interfaces\//,
      /\/types\//,
      /\/models\//,
      /\/schema\//,
      /\/layouts?\//,
      /\/pages\//,
      /\/environments\//,
      /main\.tsx$/,
      /setupTests\.ts$/,
    ];

    const testableFiles = relativeFiles.filter(
      (f) => !nonTestablePatterns.some((pattern) => pattern.test(f))
    );

    const coverageIncludes = testableFiles
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
      `bash -c "cd task-manager && ./mvnw test -Dtest=\\"!TaskManagerApplicationTests\\""`,
    ];
  },
};
