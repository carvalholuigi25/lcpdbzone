import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AllDataTvSeries, AllDataTvSeriesEpisodes, AllDataTvSeriesReviews, AllDataTvSeriesSeasons, TvSeriesEpisodesInfo, TvSeriesModel, TvSeriesReviewsInfo, TvSeriesSeasonsInfo } from "@/app/models";

@Injectable({ providedIn: 'root' })
export class TVSeriesDataService {
    private isSSL: boolean = false;
    private apiURL: string = this.getAPIURL();

    constructor(private http: HttpClient) {
    }

    private getAPIURL() {
        return `http${this.isSSL ? 's' : ''}://localhost:${this.isSSL ? '5000': '5001'}/api`;
    }

    // tv series
    getTvSeries(id?: number): Observable<AllDataTvSeries> {
        return this.http.get<AllDataTvSeries>(`${this.apiURL}/tvseries${id ? `/${id}` : ''}`);
    }

    getAllTvSeries(id?: number): Observable<TvSeriesModel> {
        return this.http.get<TvSeriesModel>(`${this.apiURL}/tvseries/all/${id ? `${id}` : ''}`);
    }

    createTVSeries(data: TvSeriesModel): Observable<TvSeriesModel> {
        return this.http.post<TvSeriesModel>(`${this.apiURL}/tvseries`, data);
    }

    updateTVSeries(id: number, data: TvSeriesModel): Observable<TvSeriesModel> {
        return this.http.put<TvSeriesModel>(`${this.apiURL}/tvseries/${id}`, data);
    }

    delTVSeries(id: number): Observable<TvSeriesModel> {
        return this.http.delete<TvSeriesModel>(`${this.apiURL}/tvseries/${id}`);
    }

    // tv series seasons
    getTvSeriesSeasonsInfo(id?: number): Observable<AllDataTvSeriesSeasons> {
        return this.http.get<AllDataTvSeriesSeasons>(`${this.apiURL}/tvseries/seasons${id ? `/${id}` : ''}`);
    }

    getAllTvSeriesSeasonsInfo(id?: number): Observable<TvSeriesSeasonsInfo> {
        return this.http.get<TvSeriesSeasonsInfo>(`${this.apiURL}/tvseries/seasons/all/${id ? `${id}` : ''}`);
    }

    createTVSeriesSeasonsInfo(data: TvSeriesSeasonsInfo): Observable<TvSeriesSeasonsInfo> {
        return this.http.post<TvSeriesSeasonsInfo>(`${this.apiURL}/tvseries/seasons`, data);
    }

    updateTVSeriesSeasonsInfo(id: number, data: TvSeriesSeasonsInfo): Observable<TvSeriesSeasonsInfo> {
        return this.http.put<TvSeriesSeasonsInfo>(`${this.apiURL}/tvseries/seasons/${id}`, data);
    }

    delTVSeriesSeasonsInfo(id: number): Observable<TvSeriesSeasonsInfo> {
        return this.http.delete<TvSeriesSeasonsInfo>(`${this.apiURL}/tvseries/seasons/${id}`);
    }

    // tv series episodes
    getTvSeriesEpisodesInfo(id?: number): Observable<AllDataTvSeriesEpisodes> {
        return this.http.get<AllDataTvSeriesEpisodes>(`${this.apiURL}/tvseries/episodes${id ? `/${id}` : ''}`);
    }

    getAllTvSeriesEpisodesInfo(id?: number): Observable<TvSeriesEpisodesInfo> {
        return this.http.get<TvSeriesEpisodesInfo>(`${this.apiURL}/tvseries/episodes/all/${id ? `${id}` : ''}`);
    }

    createTVSeriesEpisodesInfo(data: TvSeriesEpisodesInfo): Observable<TvSeriesEpisodesInfo> {
        return this.http.post<TvSeriesEpisodesInfo>(`${this.apiURL}/tvseries/episodes`, data);
    }

    updateTVSeriesEpisodesInfo(id: number, data: TvSeriesEpisodesInfo): Observable<TvSeriesEpisodesInfo> {
        return this.http.put<TvSeriesEpisodesInfo>(`${this.apiURL}/tvseries/episodes/${id}`, data);
    }

    delTVSeriesEpisodesInfo(id: number): Observable<TvSeriesEpisodesInfo> {
        return this.http.delete<TvSeriesEpisodesInfo>(`${this.apiURL}/tvseries/episodes/${id}`);
    }

    // tv series reviews
    getTvSeriesReviewsInfo(id?: number): Observable<AllDataTvSeriesReviews> {
        return this.http.get<AllDataTvSeriesReviews>(`${this.apiURL}/tvseries/reviews${id ? `/${id}` : ''}`);
    }

    getAllTvSeriesReviewsInfo(id?: number): Observable<TvSeriesReviewsInfo> {
        return this.http.get<TvSeriesReviewsInfo>(`${this.apiURL}/tvseries/reviews/all/${id ? `${id}` : ''}`);
    }

    createTVSeriesReviewsInfo(data: TvSeriesReviewsInfo): Observable<TvSeriesReviewsInfo> {
        return this.http.post<TvSeriesReviewsInfo>(`${this.apiURL}/tvseries/reviews`, data);
    }

    updateTVSeriesReviewsInfo(id: number, data: TvSeriesReviewsInfo): Observable<TvSeriesReviewsInfo> {
        return this.http.put<TvSeriesReviewsInfo>(`${this.apiURL}/tvseries/reviews/${id}`, data);
    }

    delTVSeriesReviewsInfo(id: number): Observable<TvSeriesReviewsInfo> {
        return this.http.delete<TvSeriesReviewsInfo>(`${this.apiURL}/tvseries/reviews/${id}`);
    }

    /**
     * Execute an admin SQL query on the server. The server endpoint must be implemented and secured.
     * Accepts either a string SQL or an object { sql, table }.
     */
    executeQuery(payload: { sql: string; table?: string } | string, table?: string): Observable<any> {
        const body = typeof payload === 'string' ? { sql: payload, table } : payload;
        return this.http.post<any>(`${this.apiURL}/admin/query`, body);
    }

    destroy(): void {
        // Cleanup if necessary
        this.http = null!;
    }
}