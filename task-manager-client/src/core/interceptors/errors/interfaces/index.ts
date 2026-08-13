interface HttpResponseError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors: ErrorField[];
}

interface ErrorField {
  field: string;
  message: string;
}

export type { HttpResponseError, ErrorField };