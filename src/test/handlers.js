import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("*/api/categories/", () => {
    return HttpResponse.json([{ id: 1, name: "Bathrooms" }]);
  }),
  http.get("*/api/business-info/", () => {
    return HttpResponse.json({
      company_name: "Test Company",
      phone: "(123) 456-7890",
    });
  }),
];
