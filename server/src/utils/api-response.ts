export function apiSuccess<T>(data: T, meta?: Record<string, unknown>) {
  return { success: true, data, ...(meta && { meta }) };
}

export function apiPaginated<T>(data: T[], total: number, page: number, limit: number) {
  return {
    success: true,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}