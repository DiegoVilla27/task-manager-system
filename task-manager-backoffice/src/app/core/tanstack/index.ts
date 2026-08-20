import { QueryClient } from '@tanstack/angular-query-experimental';

const tanstackConfig = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
    },
  });
};

export default tanstackConfig;
