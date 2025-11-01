export interface  Artwork {
 id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export interface ApiResponse {
  total: number;
  data: Artwork[];
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}