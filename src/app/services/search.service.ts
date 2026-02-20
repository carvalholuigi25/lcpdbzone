import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnimesDataService } from './data/animesdata.service';
import { BooksDataService } from './data/booksdata.service';
import { GamesDataService } from './data/gamesdata.service';
import { MoviesDataService } from './data/moviesdata.service';
import { TVSeriesDataService } from './data/tvseriesdata.service';

export interface SearchResult {
  id: number;
  title: string;
  type: 'anime' | 'book' | 'game' | 'movie' | 'tvseries';
  imageUrl?: string;
  description?: string;
  studio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  private searchResultsSubject = new BehaviorSubject<SearchResult[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(
    private animesService: AnimesDataService,
    private booksService: BooksDataService,
    private gamesService: GamesDataService,
    private moviesService: MoviesDataService,
    private tvseriesService: TVSeriesDataService
  ) {
    this.initializeSearch();
  }

  private initializeSearch() {
    this.searchQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(query => query.trim().toLowerCase())
      )
      .subscribe(query => {
        if (query.length === 0) {
          this.searchResultsSubject.next([]);
          return;
        }
        this.performSearch(query);
      });
  }

  private performSearch(query: string) {
    combineLatest([
      this.searchAnimes(query),
      this.searchBooks(query),
      this.searchGames(query),
      this.searchMovies(query),
      this.searchTVSeries(query)
    ])
      .pipe(
        map(([animes, books, games, movies, tvseries]) => [
          ...animes,
          ...books,
          ...games,
          ...movies,
          ...tvseries
        ])
      )
      .subscribe(results => {
        this.searchResultsSubject.next(results);
      });
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  getSearchResults(): Observable<SearchResult[]> {
    return this.searchResults$;
  }

  private searchAnimes(query: string): Observable<SearchResult[]> {
    return this.animesService.getAnimes().pipe(
      map((response: any) => {
        const items = response.data || [];
        return items
          .filter((anime: any) =>
            anime.title?.toLowerCase().includes(query) ||
            anime.studio?.toLowerCase().includes(query) ||
            anime.genre?.toLowerCase().includes(query)
          )
          .map((anime: any) => ({
            id: anime.animeId,
            title: anime.title,
            type: 'anime' as const,
            imageUrl: anime.image,
            description: anime.description,
            studio: anime.studio
          }))
          .slice(0, 5);
      })
    );
  }

  private searchBooks(query: string): Observable<SearchResult[]> {
    return this.booksService.getBooks().pipe(
      map((response: any) => {
        const items = response.data || [];
        return items
          .filter((book: any) =>
            book.title?.toLowerCase().includes(query) ||
            book.studio?.toLowerCase().includes(query) ||
            book.genre?.toLowerCase().includes(query)
          )
          .map((book: any) => ({
            id: book.bookId,
            title: book.title,
            type: 'book' as const,
            imageUrl: book.image,
            description: book.description,
            studio: book.studio
          }))
          .slice(0, 5);
      })
    );
  }

  private searchGames(query: string): Observable<SearchResult[]> {
    return this.gamesService.getGames().pipe(
      map((response: any) => {
        const items = response.data || [];
        return items
          .filter((game: any) =>
            game.title?.toLowerCase().includes(query) ||
            game.studio?.toLowerCase().includes(query) ||
            game.genre?.toLowerCase().includes(query)
          )
          .map((game: any) => ({
            id: game.gameId,
            title: game.title,
            type: 'game' as const,
            imageUrl: game.image,
            description: game.description,
            studio: game.studio
          }))
          .slice(0, 5);
      })
    );
  }

  private searchMovies(query: string): Observable<SearchResult[]> {
    return this.moviesService.getMovies().pipe(
      map((response: any) => {
        const items = response.data || [];
        return items
          .filter((movie: any) =>
            movie.title?.toLowerCase().includes(query) ||
            movie.studio?.toLowerCase().includes(query) ||
            movie.genre?.toLowerCase().includes(query)
          )
          .map((movie: any) => ({
            id: movie.movieId,
            title: movie.title,
            type: 'movie' as const,
            imageUrl: movie.image,
            description: movie.description,
            studio: movie.studio
          }))
          .slice(0, 5);
      })
    );
  }

  private searchTVSeries(query: string): Observable<SearchResult[]> {
    return this.tvseriesService.getTvSeries().pipe(
      map((response: any) => {
        const items = response.data || [];
        return items
          .filter((tvseries: any) =>
            tvseries.title?.toLowerCase().includes(query) ||
            tvseries.studio?.toLowerCase().includes(query) ||
            tvseries.genre?.toLowerCase().includes(query)
          )
          .map((tvseries: any) => ({
            id: tvseries.tvserieId,
            title: tvseries.title,
            type: 'tvseries' as const,
            imageUrl: tvseries.image,
            description: tvseries.description,
            studio: tvseries.studio
          }))
          .slice(0, 5);
      })
    );
  }

  clearSearch() {
    this.searchQuerySubject.next('');
    this.searchResultsSubject.next([]);
  }
}

