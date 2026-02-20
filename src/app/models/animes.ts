export interface AllDataAnimes {
    totalCount: number;
    page: number;
    pageSize: number;
    data: AnimesModel[];
}

export interface AnimesModel {
  animeId?: number;
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
  AnimesMediasInfo?: AnimesMedias[];
}

export interface AnimesMedias {
  mediaId: number;
  animeId: number;
  url: string;
  isFeatured: boolean;
  typeMedia: string;
}