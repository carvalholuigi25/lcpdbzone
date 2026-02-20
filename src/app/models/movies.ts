export interface AllDataMovies {
    totalCount: number;
    page: number;
    pageSize: number;
    data: MoviesModel[];
}

export interface MoviesModel {
  movieId?: number;
  title: string;
  description?: string;
  image?: string;
  artwork?: string;
  studio?: string;
  isFeatured?: boolean;
  scoreRating?: number;
  releaseDate?: string | Date;
  genre?: string | string[];
  format?: string | string[];
  MoviesMediasInfo?: MoviesMedias[];
}

export interface MoviesMedias {
  mediaId: number;
  movieId: number;
  url: string;
  isFeatured: boolean;
  typeMedia: string;
}