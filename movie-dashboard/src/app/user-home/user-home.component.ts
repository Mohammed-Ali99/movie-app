import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastComponent } from '../toast.component';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';

interface MovieItem {
  id?: number;
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  movies = signal<MovieItem[]>([]);
  searchKey = signal<string>('');
  private searchTimer: any;
  busyRating = signal<Set<number>>(new Set());

  constructor() {
    this.fetchUserMovies();
  }

  trackByImdb = (_: number, m: MovieItem) => m.imdbID;

  onImgError(evt: Event) {
    const img = evt.target as HTMLImageElement | null;
    if (img) {
      img.style.visibility = 'hidden';
    }
  }

  openDetails(m: MovieItem) {
    const id = m.id ?? (isFinite(Number(m.imdbID)) ? Number(m.imdbID) : null);
    if (id != null) {
      this.router.navigate(['movie', id]);
    }
  }

  rateMovie(m: MovieItem, stars: number, ev?: Event) {
    ev?.stopPropagation();
    if ((!m.id && !Number.isFinite(Number(m.imdbID))) || stars < 1 || stars > 5) {
      this.toast.show('This movie cannot be rated (missing id).', 'error', 3000);
      return;
    }
    const movieId = m.id ?? Number(m.imdbID);
    const key = movieId as number;
    const set = new Set(this.busyRating());
    set.add(key);
    this.busyRating.set(set);

    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const body = { movieId, stars } as const;

    this.http.post('http://localhost:8082/api/rating', body, { headers }).subscribe({
      next: (res: any) => {
        const message = (res && typeof res === 'object' && 'message' in res) ? (res as any).message : 'Rated successfully.';
        this.toast.show(message, 'success');
      },
      error: (e) => {
        const msg =
          (e?.error && typeof e.error === 'object' && 'message' in e.error ? (e.error as any).message :
          (typeof e?.error === 'string' ? e.error :
          (e?.message ?? 'Failed to rate')));
        this.toast.show(msg, 'error', 4500);
      },
      complete: () => {
        const s = new Set(this.busyRating());
        s.delete(key);
        this.busyRating.set(s);
      }
    });
  }

  onSearchInput(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.searchKey.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const key = this.searchKey().trim();
      this.fetchUserMovies(key.length ? key : undefined);
    }, 400);
  }

  onSearchSubmit() {
    const key = this.searchKey().trim();
    this.fetchUserMovies(key.length ? key : undefined);
  }

  private fetchUserMovies(searchKey?: string) {
    this.loading.set(true);
    this.error.set(null);

    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const options: any = { headers };
    if (searchKey) {
      options.params = { searchKey };
    }

    this.http.get<any>('http://localhost:8082/api/user/movies', options).subscribe({
      next: (res) => {
        // Support multiple response shapes
        const payload = (res && typeof res === 'object' && 'data' in res) ? (res as any).data : res;
        let list: any[] = [];
        if (Array.isArray(payload)) {
          list = payload as any[];
        } else if (payload && typeof payload === 'object') {
          list = (payload as any).movies || (payload as any).list || (payload as any).Search || (payload as any).search || [];
        }
        const normalized = (Array.isArray(list) ? list : []).map((it) => ({
          id: (it as any)?.id,
          Title: it?.Title ?? it?.title ?? '',
          Year: it?.Year ?? it?.year ?? '',
          imdbID: it?.imdbID ?? it?.imdbId ?? it?.id ?? '',
          Type: it?.Type ?? it?.type ?? '',
          Poster: it?.Poster ?? it?.poster ?? ''
        })) as MovieItem[];
        this.movies.set(normalized);
        this.loading.set(false);
      },
      error: (e) => {
        const msg = (e?.error && (typeof e.error === 'string' ? e.error : JSON.stringify(e.error))) || e?.message || 'Failed to load movies';
        this.error.set(msg);
        this.loading.set(false);
      }
    });
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }
}
