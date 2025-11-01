import type{ ApiResponse, PaginationParams } from '../types';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.artic.edu/api/v1',
  timeout: 10000,
});

export const fetchArtworks = async (params: PaginationParams): Promise<ApiResponse> => {
  try {
    const response = await api.get('/artworks', {
      params: {
        page: params.page,
        limit: params.limit,
        fields: 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end,image_id'
      }
    });

    return response.data;
  } catch (error: unknown) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to fetch artworks');
    } else {
      throw new Error('Failed to fetch artworks');
    }
  }
};