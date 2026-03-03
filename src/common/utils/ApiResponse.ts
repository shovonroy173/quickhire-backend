export class ApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
  meta?: any;

  constructor(
    status: 'success' | 'error',
    data?: any,
    message?: string,
    meta?: any
  ) {
    this.status = status;
    if (message) this.message = message;
    if (data) this.data = data;
    if (meta) this.meta = meta;
  }

  static success(data?: any, message?: string, meta?: any) {
    return new ApiResponse('success', data, message, meta);
  }

  static error(message: string, data?: any) {
    return new ApiResponse('error', data, message);
  }
}
