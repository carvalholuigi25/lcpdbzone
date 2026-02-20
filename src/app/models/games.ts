export interface AllDataGames {
    totalCount: number;
    page: number;
    pageSize: number;
    data: GamesModel[];
}

export interface GamesModel {
  gameId?: number;
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
  GamesMediasInfo?: GamesMedias[];
}

export interface GamesMedias {
  mediaId: number;
  gameId: number;
  url: string;
  isFeatured: boolean;
  typeMedia: string;
}