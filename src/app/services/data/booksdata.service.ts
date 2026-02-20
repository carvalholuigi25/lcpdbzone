import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AllDataBooks, BooksModel } from "@/app/models";

@Injectable({ providedIn: 'root' })
export class BooksDataService {
    private isSSL: boolean = false;
    private apiURL: string = this.getAPIURL();

    constructor(private http: HttpClient) {
    }

    private getAPIURL() {
        return `http${this.isSSL ? 's' : ''}://localhost:${this.isSSL ? '5000': '5001'}/api`;
    }

    getBooks(id?: number): Observable<AllDataBooks> {
        return this.http.get<AllDataBooks>(`${this.apiURL}/books${id ? `/${id}` : ''}`);
    }

    createBooks(data: BooksModel): Observable<BooksModel> {
        return this.http.post<BooksModel>(`${this.apiURL}/books`, data);
    }

    updateBooks(id: number, data: BooksModel): Observable<BooksModel> {
        return this.http.put<BooksModel>(`${this.apiURL}/books/${id}`, data);
    }

    delBooks(id: number): Observable<BooksModel> {
        return this.http.delete<BooksModel>(`${this.apiURL}/books/${id}`);
    }

    destroy(): void {
        // Cleanup if necessary
        this.http = null!;
    }
}