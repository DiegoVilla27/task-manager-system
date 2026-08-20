interface Pagination<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
}

export { type Pagination };
