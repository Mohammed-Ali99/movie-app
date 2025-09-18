import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { ToastComponent } from '../toast.component';

interface MovieItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieSearchResponse {
  Search: MovieItem[];
  totalResults?: string;
  Response?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  movies = signal<MovieItem[]>([]);
  busyAdd = signal<Set<string>>(new Set());
  busyDelete = signal<Set<string>>(new Set());

  constructor() {
    this.loadMovies();
  }

  trackByImdb = (_: number, m: MovieItem) => m.imdbID;

  onImgError(evt: Event) {
    const img = evt.target as HTMLImageElement | null;
    if (img) {
      img.style.visibility = 'hidden';
    }
  }

  addMovie(m: MovieItem) {
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const body = {
      title: m.Title,
      year: m.Year,
      imdbId: m.imdbID,
      type: m.Type,
      poster: m.Poster
    };

    const key = m.imdbID;
    const addSet = new Set(this.busyAdd());
    addSet.add(key);
    this.busyAdd.set(addSet);

    this.http.post('http://localhost:8082/api/admin/movies', body, { headers }).subscribe({
      next: (res: any) => {
        console.debug('[add movie] success', res);
        // Show popup with message from API
        const message = (res && typeof res === 'object' && 'message' in res) ? (res as any).message : 'Created successfully.';
        this.toast.show(message, 'success');
      },
      error: (e) => {
        console.debug('[add movie] error', e);
        const msg =
          (e?.error && typeof e.error === 'object' && 'message' in e.error ? (e.error as any).message :
          (typeof e?.error === 'string' ? e.error :
          (e?.message ?? 'Failed to add movie')));
        this.toast.show(msg, 'error', 4500);
      },
      complete: () => {
        const s = new Set(this.busyAdd());
        s.delete(key);
        this.busyAdd.set(s);
      }
    });
  }

  deleteMovie(m: MovieItem) {
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const idOrImdb = encodeURIComponent(m.imdbID);
    const url = `http://localhost:8082/api/admin/movies/${idOrImdb}`;

    const key = m.imdbID;
    const delSet = new Set(this.busyDelete());
    delSet.add(key);
    this.busyDelete.set(delSet);

    this.http.delete(url, { headers }).subscribe({
      next: (res: any) => {
        console.debug('[delete movie] success', res);
        // Optimistically remove from list
        this.movies.update(list => list.filter(x => x.imdbID !== m.imdbID));
        const message = (res && typeof res === 'object' && 'message' in res) ? (res as any).message : 'Deleted successfully.';
        this.toast.show(message, 'success');
      },
      error: (e) => {
        console.debug('[delete movie] error', e);
      },
      complete: () => {
        const s = new Set(this.busyDelete());
        s.delete(key);
        this.busyDelete.set(s);
      }
    });
  }

  private loadMovies() {
    this.loading.set(true);
    this.error.set(null);

    const token = this.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    this.http
      .get<any>('http://localhost:8082/api/admin/movies/search', {
        headers,
        params: { keyword: 'batman', page: 1 as any }
      })
      .subscribe({
        next: (res) => {
          // Unwrap data payload if response is wrapped: { data: { ... }, code, message }
          const payload = (res && typeof res === 'object' && 'data' in res) ? (res as any).data : res;

          // Handle body-level error or negative response flags
          const responseFlag = (payload?.Response ?? payload?.response) as string | undefined;
          const bodyError = (payload?.error ?? (res as any)?.error ?? null) as string | null;
          if (bodyError) {
            this.error.set(bodyError);
            this.movies.set([]);
            this.loading.set(false);
            return;
          }
          if (responseFlag && responseFlag.toString().toLowerCase() === 'false') {
            this.error.set('No results found');
            this.movies.set([]);
            this.loading.set(false);
            return;
          }

          const rawList = (payload?.Search ?? payload?.search ?? []) as any[];
          const normalized = (Array.isArray(rawList) ? rawList : []).map((it) => ({
            Title: it?.Title ?? it?.title ?? '',
            Year: it?.Year ?? it?.year ?? '',
            imdbID: it?.imdbID ?? it?.imdbId ?? it?.imdbid ?? '',
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
