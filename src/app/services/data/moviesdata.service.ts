import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AllDataMovies, MoviesModel } from "@/app/models";

@Injectable({ providedIn: 'root' })
export class MoviesDataService {
    private isSSL: boolean = false;
    private apiURL: string = this.getAPIURL();

    constructor(private http: HttpClient) {
    }

    private getAPIURL() {
        return `http${this.isSSL ? 's' : ''}://localhost:${this.isSSL ? '5000': '5001'}/api`;
    }

    getMovies(id?: number): Observable<AllDataMovies> {
        return this.http.get<AllDataMovies>(`${this.apiURL}/movies${id ? `/${id}` : ''}`);
    }

    createMovies(data: MoviesModel): Observable<MoviesModel> {
        return this.http.post<MoviesModel>(`${this.apiURL}/movies`, data);
    }

    updateMovies(id: number, data: MoviesModel): Observable<MoviesModel> {
        return this.http.put<MoviesModel>(`${this.apiURL}/movies/${id}`, data);
    }

    delMovies(id: number): Observable<MoviesModel> {
        return this.http.delete<MoviesModel>(`${this.apiURL}/movies/${id}`);
    }

    destroy(): void {
        // Cleanup if necessary
        this.http = null!;
    }
}