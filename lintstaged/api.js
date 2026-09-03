export const apiConfig = {
  "task-manager/src/**/*.java": () => {
    return [
      `bash -c 'cd task-manager && ./mvnw spotless:apply'`,
      `bash -c 'cd task-manager && ./mvnw test -Dtest="!TaskManagerApplicationTests"'`,
    ];
  },
}