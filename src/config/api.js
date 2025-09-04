const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/dealers/login`,
  REGISTER: `${API_BASE_URL}/auth/dealers/register`,

  // Properties
  PROPERTIES: `${API_BASE_URL}/properties/`,
  PROPERTIES_DEALER: `${API_BASE_URL}/properties/dealer/`,
  PROPERTIES_ADMIN: `${API_BASE_URL}/properties/admin/`,

  // Upload
  PRESIGNED_URLS: `${API_BASE_URL}/cloudfare/presigned-urls`,

  // Admin
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_DEALERS_LOCATIONS: `${API_BASE_URL}/admin/dealers/locations/sublocations`,
  ADMIN_DEALERS_WITH_PROPERTIES: `${API_BASE_URL}/admin/dealers/with-properties`,
  ADMIN_DEALERS: `${API_BASE_URL}/admin/dealers/`,
  ADMIN_DEALER_UPDATE: `${API_BASE_URL}/admin/dealers/`,
  ADMIN_DEALER_DELETE: `${API_BASE_URL}/admin/dealers/`,
  ADMIN_DEALER_PASSWORD: `${API_BASE_URL}/admin/dealers/reset-password/`,

  // Leads/Client Management
  LEADS_ADMIN: `${API_BASE_URL}/leads/admin/`,
  LEADS_SEARCH: `${API_BASE_URL}/leads/search`,
  LEADS: `${API_BASE_URL}/leads/`,

  DEALER_CLIENTS: `${API_BASE_URL}/dealer-clients/`,

  // R2 Public Domain
  R2_PUBLIC_DOMAIN: "https://pub-1a0c1e81896647d38b50db8319081047.r2.dev",
};
