export interface AllDataBooks {
    totalCount: number;
    page: number;
    pageSize: number;
    data: BooksModel[];
}

export interface BooksModel {
  bookId?: number;
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
  BooksMediasInfo?: BooksMedias[];
}

export interface BooksMedias {
  mediaId: number;
  bookId: number;
  url: string;
  isFeatured: boolean;
  typeMedia: string;
}