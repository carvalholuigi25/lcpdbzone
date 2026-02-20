import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '@/app/guards';

export const DATA_LAZY_ROUTES: Routes = (() => {
  // small helper to create guarded admin routes and reduce repetition
  const guarded = (path: string, loader: any) => ({ path, loadComponent: loader, canActivate: [AdminAuthGuard] });
  return [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('@pages/data/data').then((m) => m.Data), data: { title: 'Data Home' } },
    // Games routes
    {
      path: 'games',
      children: [
        { path: '', loadComponent: () => import('@pages/data/games/games').then((m) => m.Games) },
        { path: ':id', loadComponent: () => import('@pages/data/games/crud/games-details/games-details').then((m) => m.GamesDetails) },
        guarded('crud/create', () => import('@pages/data/games/crud/create-games/create-games').then((m) => m.CreateGames)),
        guarded('crud/update/:id', () => import('@pages/data/games/crud/update-games/update-games').then((m) => m.UpdateGames)),
        guarded('crud/delete/:id', () => import('@pages/data/games/crud/delete-games/delete-games').then((m) => m.DeleteGames)),
      ]
    },
    // Movies routes
    {
      path: 'movies',
      children: [
        { path: '', loadComponent: () => import('@pages/data/movies/movies').then((m) => m.Movies) },
        { path: ':id', loadComponent: () => import('@pages/data/movies/crud/movies-details/movies-details').then((m) => m.MoviesDetails) },
        guarded('crud/create', () => import('@pages/data/movies/crud/create-movies/create-movies').then((m) => m.CreateMovies)),
        guarded('crud/update/:id', () => import('@pages/data/movies/crud/update-movies/update-movies').then((m) => m.UpdateMovies)),
        guarded('crud/delete/:id', () => import('@pages/data/movies/crud/delete-movies/delete-movies').then((m) => m.DeleteMovies)),
      ]
    },
    // Tvseries routes (grouped info + crud)
    {
      path: 'tvseries',
      children: [
        { path: '', loadComponent: () => import('@pages/data/tvseries/tvseries').then((m) => m.Tvseries) },
        { path: ':id', loadComponent: () => import('@pages/data/tvseries/crud/tvseries-details/tvseries-details').then((m) => m.TvseriesDetails) },
        { 
          path: 'info', 
          children: [
            { path: '', redirectTo: '/tvseries', pathMatch: 'full'},
            { path: '**', redirectTo: '/tvseries', pathMatch: 'full'},
            { path: 'seasons', loadComponent: () => import('@pages/data/tvseries/info/seasons/seasons').then((m) => m.TVSeriesSeasons) },
            { path: 'episodes', loadComponent: () => import('@pages/data/tvseries/info/episodes/episodes').then((m) => m.TVSeriesEpisodes) },
            { path: 'reviews', loadComponent: () => import('@pages/data/tvseries/info/reviews/reviews').then((m) => m.TVSeriesReviews)
          }]
        },
        guarded('crud/create', () => import('@pages/data/tvseries/crud/create-tvseries/create-tvseries').then((m) => m.CreateTvseries)),
        guarded('crud/update/:id', () => import('@pages/data/tvseries/crud/update-tvseries/update-tvseries').then((m) => m.UpdateTvseries)),
        guarded('crud/delete/:id', () => import('@pages/data/tvseries/crud/delete-tvseries/delete-tvseries').then((m) => m.DeleteTvseries)),
      ]
    },
    // Animes routes
    {
      path: 'animes',
      children: [
        { path: '', loadComponent: () => import('@pages/data/animes/animes').then((m) => m.Animes) },
        { path: ':id', loadComponent: () => import('@pages/data/animes/crud/animes-details/animes-details').then((m) => m.AnimesDetails) },
        guarded('crud/create', () => import('@pages/data/animes/crud/create-animes/create-animes').then((m) => m.CreateAnimes)),
        guarded('crud/update/:id', () => import('@pages/data/animes/crud/update-animes/update-animes').then((m) => m.UpdateAnimes)),
        guarded('crud/delete/:id', () => import('@pages/data/animes/crud/delete-animes/delete-animes').then((m) => m.DeleteAnimes)),
      ]
    },
    // Books routes
    {
      path: 'books',
      children: [
        { path: '', loadComponent: () => import('@pages/data/books/books').then((m) => m.Books) },
        { path: ':id', loadComponent: () => import('@pages/data/books/crud/books-details/books-details').then((m) => m.BooksDetails) },
        guarded('crud/create', () => import('@pages/data/books/crud/create-books/create-books').then((m) => m.CreateBooks)),
        guarded('crud/update/:id', () => import('@pages/data/books/crud/update-books/update-books').then((m) => m.UpdateBooks)),
        guarded('crud/delete/:id', () => import('@pages/data/books/crud/delete-books/delete-books').then((m) => m.DeleteBooks)),
      ]
    },
    { path: '**', redirectTo: '/errors/notfound' }
  ];
})();


@NgModule({
  imports: [RouterModule.forChild(DATA_LAZY_ROUTES)],
  exports: [RouterModule]
})
export class DataLazyRoutesModule {}
