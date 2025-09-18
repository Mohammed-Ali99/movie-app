import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastComponent } from '../toast.component';
import { ToastService } from '../toast.service';

interface MovieDetails {
  id: number;
  imdbId: string;
  title: string;
  year: string;
  type: string;
  poster: string;
}

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  loading = signal(true);
  error = signal<string | null>(null);
  movie = signal<MovieDetails | null>(null);

  constructor() {
    this.fetch();
  }

  private fetch() {
    this.loading.set(true);
    this.error.set(null);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing movie id');
      this.loading.set(false);
      return;
    }

    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    // Determine role to select endpoint
    const payload = this.decodeJwt(token || '');
    const authorities = this.extractAuthorities(payload);
    const hasUser = authorities.includes('ROLE_USER');
    const base = hasUser ? 'http://localhost:8082/api/user/movies' : 'http://localhost:8082/api/admin/movies';

    const url = `${base}/${encodeURIComponent(id)}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (res) => {
        // Expecting { data: { ... }, code, message }
        const payload = (res && typeof res === 'object' && 'data' in res) ? (res as any).data : res;
        if (!payload) {
          const msg = (res && (res as any).message) || 'Movie not found';
          this.toast.show(String(msg), 'error', 4000);
          this.error.set('Not found');
          this.loading.set(false);
          return;
        }
        const details: MovieDetails = {
          id: Number((payload as any).id),
          imdbId: (payload as any).imdbId ?? (payload as any).imdbID ?? '',
          title: (payload as any).title ?? (payload as any).Title ?? '',
          year: (payload as any).year ?? (payload as any).Year ?? '',
          type: (payload as any).type ?? (payload as any).Type ?? '',
          poster: (payload as any).poster ?? (payload as any).Poster ?? ''
        };
        this.movie.set(details);
        this.loading.set(false);
      },
      error: (e) => {
        const msg = (e?.error && typeof e.error === 'object' && 'message' in e.error)
          ? (e.error as any).message
          : (typeof e?.error === 'string' ? e.error : (e?.message ?? 'Failed to load movie'));
        this.toast.show(String(msg), 'error', 4500);
        this.error.set(String(msg));
        this.loading.set(false);
      }
    });
  }

  back() {
    // Prefer going back to user-home if ROLE_USER, otherwise home
    const token = this.getToken();
    const payload = this.decodeJwt(token || '');
    const authorities = this.extractAuthorities(payload);
    const hasUser = authorities.includes('ROLE_USER');
    this.router.navigate([hasUser ? 'user-home' : 'home']);
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }

  private decodeJwt(token: string): any | null {
    try {
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(payload).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private extractAuthorities(jwtPayload: any): string[] {
    if (!jwtPayload) return [];
    const val = jwtPayload?.AUTHORITIES ?? jwtPayload?.authorities ?? jwtPayload?.roles ?? jwtPayload?.scope;
    if (!val) return [];
    if (Array.isArray(val)) return val.map(String);
    if (typeof val === 'string') {
      return val.includes(',') ? val.split(',').map(s => s.trim()) : val.split(' ').map(s => s.trim());
    }
    return [];
  }
}
