export const apiConfig = {
  "apps/task-manager/src/**/*.java": () => {
    return [
      `bash -c 'cd apps/task-manager && ./mvnw spotless:apply'`,
      `bash -c 'cd apps/task-manager && ./mvnw test -Dtest="!TaskManagerApplicationTests"'`,
    ];
  },
}