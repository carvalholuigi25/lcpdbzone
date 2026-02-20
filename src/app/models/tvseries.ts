export interface AllDataTvSeries {
    totalCount: number;
    page: number;
    pageSize: number;
    data: TvSeriesModel[];
}

export interface AllDataTvSeriesSeasons {
    totalCount: number;
    page: number;
    pageSize: number;
    data: TvSeriesSeasonsInfo[];
}

export interface AllDataTvSeriesEpisodes {
    totalCount: number;
    page: number;
    pageSize: number;
    data: TvSeriesEpisodesInfo[];
}

export interface AllDataTvSeriesReviews {
    totalCount: number;
    page: number;
    pageSize: number;
    data: TvSeriesReviewsInfo[];
}

export interface TvSeriesModel {
  tvserieId?: number;
  title: string;
  description?: string;
  image?: string;
  artwork?: string;
  studio?: string;
  isFeatured?: boolean;
  releaseDate?: string | Date;
  genre?: string | string[] | TvserieGenre[];
  format?: string | string[] | TvserieFormat[];
  scoreRating?: number;
  numSeasons?: number;
  numEpisodes?: number;
  seasonsInfo?: TvSeriesSeasonsInfo[];
  episodesInfos?: TvSeriesEpisodesInfo[];
  reviewsInfos?: TvSeriesReviewsInfo[];
  tvseriesMediasInfo?: TvSeriesMedias[];
}

export interface TvSeriesSeasonsInfo {
  seasonsId: number;
  seasonsTitle: string;
  seasonsDescription: string;
  seasonsImage: string;
  seasonsCover: string;
  seasonsReleaseDate: string | Date;
  seasonsIsWatched?: boolean;
  seasonsScoreRating?: number;
  tvserieId: number;
}

export interface TvSeriesEpisodesInfo {
  episodesId: number;
  episodesTitle: string;
  episodesDescription: string;
  episodesImage: string;
  episodesCover: string;
  episodesReleaseDate: string | Date;
  episodesIsWatched?: boolean;
  episodesScoreRating?: number;
  seasonsId: number;
  tvserieId: number;
  reactionsInfo?: TvSeriesReactions[];
  commentsInfo?: TvSeriesComments[];
}

export interface TvSeriesReviewsInfo {
  reviewsId: number;
  reviewsTitle: string;
  reviewsDescription: string;
  reviewsImage?: string;
  reviewsCover?: string;
  reviewsIsFeatured?: boolean;
  reviewsDateTime?: Date | string;
  reviewsStatus?: TvseriesReviewsStatus | string;
  reviewsViews?: number;
  reviewsScoreRating?: number;
  episodesId: number;
  seasonsId: number;
  tvserieId: number;
  userId?: number;
}

export interface TvSeriesMedias {
  mediaId: number;
  tvserieId: number;
  url: string;
  isFeatured: boolean;
  typeMedia: string;
}

export interface TvSeriesReactions {
  tvseriesReactionsId: number;
  reactionsType: TvseriesReactionType | string;
  reviewId: number;
  episodeId: number;
  seasonId: number;
  tvserieId: number;
  userId: number;
}

export interface TvSeriesComments {
  commentsId: number;
  commentsTitle: string;
  commentsDescription: string;
  commentsIsFeatured?: boolean;
  commentsDateTime?: Date | string;
  commentsStatus: TvseriesCommentsStatus | string;
  reviewsId: number;
  episodesId: number;
  seasonsId: number;
  tvserieId: number;
  userId: number;
}

export enum TvserieFormat
{
    Tvserie,
    ShortFilm,
    Documentary,
    Series
}

export enum TvserieGenre
{
    Action,
    Adventure,
    Comedy,
    Drama,
    Fantasy,
    Horror,
    Mystery,
    Romance,
    SciFi,
    Thriller,
    Animation,
    Family,
    Musical,
    Crime,
    Biography,
    History,
    War,
    Western
}

export enum TvseriesReviewsStatus
{
    draft,
    published,
    locked,
    updated,
    trash,
    deleted
}

export enum TvseriesCommentsStatus
{
    draft,
    published,
    locked,
    updated,
    trash,
    deleted
}

export enum TvseriesReactionType {
  like,
  dislike,
  love,
  hate,
  cry,
  gross,
  thinking,
  awesome,
  dontknow,
  custom,
  unknown
}