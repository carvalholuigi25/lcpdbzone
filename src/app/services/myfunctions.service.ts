import { AlertModel } from '@/app/components';
import { dataAryPages } from '../models/dataarypages';

export class myFunctionsService {
  constructor() {}

  getAlertWarning(message: string): AlertModel {
    return {
      alertType: 'warning',
      icoType: 'bi-exclamation-octagon-fill',
      message: message,
    };
  }

  getPagesLinksData(): dataAryPages[] {
    return [
      {
        id: 1,
        title: 'Games',
        link: '/data/games',
        icon: 'bi-controller',
      },
      {
        id: 2,
        title: 'Movies',
        link: '/data/movies',
        icon: 'bi-film',
      },
      {
        id: 3,
        title: 'Animes',
        link: '/data/animes',
        icon: 'bi-tv',
      },
      {
        id: 4,
        title: 'TV Series',
        link: '/data/tvseries',
        icon: 'bi-tv',
      },
      {
        id: 5,
        title: 'Books',
        link: '/data/books',
        icon: 'bi-book',
      },
    ];
  }

  getOrderedPagesLinks() {
    return this.getPagesLinksData().sort((a, b) => a.title.localeCompare(b.title.toLocaleLowerCase()!));
  }
}
