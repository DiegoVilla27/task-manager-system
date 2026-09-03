export const clientConfig = {
  "task-manager-client/**/*.{ts,tsx}": (filenames) => {
    const filesList = filenames.join(" ");

    // 1. Filtrar ÚNICAMENTE los archivos de test presentes en staged
    const testFiles = filenames
      .map((f) => f.replace(/\\/g, "/"))
      .filter((f) => /\.(test|spec)\.[jt]sx?$/.test(f));

    // 2. Comandos base para todo archivo modificado
    const commands = [
      `pnpm --dir task-manager-client exec prettier --write ${filesList}`,
      `pnpm --dir task-manager-client exec oxlint ${filesList}`,
      `pnpm --dir task-manager-client exec tsc -b`,
    ];

    // 3. Si hay tests en staged, ejecutar SOLO esos
    if (testFiles.length > 0) {
      const testsToRun = testFiles.join(" ");
      commands.push(
        `pnpm --dir task-manager-client exec vitest run --passWithNoTests ${testsToRun}`
      );
    }

    return commands;
  },
  "task-manager-client/**/*.{json,css,html,md}": (filenames) => [
    `pnpm --dir task-manager-client exec prettier --write ${filenames.join(" ")}`,
  ],
};