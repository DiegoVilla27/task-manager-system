export const backofficeConfig = {
  "apps/task-manager-backoffice/**/*.{ts,html}": (filenames) => {
    const filesList = filenames.join(" ");

    // 1. Filtrar ÚNICAMENTE los archivos .spec.ts que están en el commit actual
    const specFiles = filenames
      .map((f) => f.replace(/\\/g, "/"))
      .filter((f) => f.includes("/src/") && f.endsWith(".spec.ts"));

    // 2. Comandos base para todo archivo modificado
    const commands = [
      `pnpm --dir apps/task-manager-backoffice exec prettier --write ${filesList}`,
      `pnpm --dir apps/task-manager-backoffice exec eslint --no-warn-ignored ${filesList}`,
      `pnpm --dir apps/task-manager-backoffice exec tsc --noEmit`
    ];

    // 3. Si hay .spec.ts de src/ en staged, ejecutar SOLO esos con Karma
    if (specFiles.length > 0) {
      // Angular CLI necesita la ruta relativa a la carpeta del proyecto (task-manager-backoffice/)
      const relativeSpecs = specFiles.map((f) =>
        f.replace(/^.*?task-manager-backoffice\//, "")
      );

      const includeFlags = relativeSpecs
        .map((spec) => `--include="${spec}"`)
        .join(" ");

      commands.push(
        `pnpm --dir apps/task-manager-backoffice exec ng test --watch=false --browsers=ChromeHeadlessCI ${includeFlags}`
      );
    }

    return commands;
  },
  "apps/task-manager-backoffice/**/*.{json,scss,css,md}": (filenames) => {
    return [
      `pnpm --dir apps/task-manager-backoffice exec prettier --write ${filenames.join(" ")}`,
    ];
  },
}