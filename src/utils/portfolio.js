export const extractItems = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.portfolio_items)) return payload.portfolio_items;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

export const getPaginationMeta = (payload, currentPage, pageSize) => {
  if (!payload) {
    return {
      page: currentPage,
      page_size: pageSize,
      has_next: false,
      has_previous: currentPage > 1,
      total_pages: 1,
      count: 0,
    };
  }

  const p = payload.pagination || payload;
  const count = p.total_items ?? p.count ?? extractItems(payload).length;
  const totalPages = p.total_pages ?? (count ? Math.ceil(count / pageSize) : 1);
  const page = p.current_page ?? p.page ?? currentPage;

  return {
    page,
    page_size: p.page_size ?? pageSize,
    has_next: p.has_next ?? page < totalPages,
    has_previous: p.has_previous ?? page > 1,
    total_pages: totalPages,
    count,
  };
};
