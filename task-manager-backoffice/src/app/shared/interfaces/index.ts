interface Pagination<T> {
  content: T[];
  totalElements: 0;
  totalPages: 0;
  size: 0;
}

export { type Pagination };
