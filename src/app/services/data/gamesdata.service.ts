import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AllDataGames, GamesModel } from "@/app/models";

@Injectable({ providedIn: 'root' })
export class GamesDataService {
    private isSSL: boolean = false;
    private apiURL: string = this.getAPIURL();

    constructor(private http: HttpClient) {
    }

    private getAPIURL() {
        return `http${this.isSSL ? 's' : ''}://localhost:${this.isSSL ? '5000': '5001'}/api`;
    }

    getGames(id?: number): Observable<AllDataGames> {
        return this.http.get<AllDataGames>(`${this.apiURL}/games${id ? `/${id}` : ''}`);
    }

    createGames(data: GamesModel): Observable<GamesModel> {
        return this.http.post<GamesModel>(`${this.apiURL}/games`, data);
    }

    updateGames(id: number, data: GamesModel): Observable<GamesModel> {
        return this.http.put<GamesModel>(`${this.apiURL}/games/${id}`, data);
    }

    delGames(id: number): Observable<GamesModel> {
        return this.http.delete<GamesModel>(`${this.apiURL}/games/${id}`);
    }

    destroy(): void {
        // Cleanup if necessary
        this.http = null!;
    }
}