import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AllDataAnimes, AnimesModel } from "@/app/models";

@Injectable({ providedIn: 'root' })
export class AnimesDataService {
    private isSSL: boolean = false;
    private apiURL: string = this.getAPIURL();

    constructor(private http: HttpClient) {
    }

    private getAPIURL() {
        return `http${this.isSSL ? 's' : ''}://localhost:${this.isSSL ? '5000': '5001'}/api`;
    }

    getAnimes(id?: number): Observable<AllDataAnimes> {
        return this.http.get<AllDataAnimes>(`${this.apiURL}/animes${id ? `/${id}` : ''}`);
    }

    createAnimes(data: AnimesModel): Observable<AnimesModel> {
        return this.http.post<AnimesModel>(`${this.apiURL}/animes`, data);
    }

    updateAnimes(id: number, data: AnimesModel): Observable<AnimesModel> {
        return this.http.put<AnimesModel>(`${this.apiURL}/animes/${id}`, data);
    }

    delAnimes(id: number): Observable<AnimesModel> {
        return this.http.delete<AnimesModel>(`${this.apiURL}/animes/${id}`);
    }

    destroy(): void {
        // Cleanup if necessary
        this.http = null!;
    }
}