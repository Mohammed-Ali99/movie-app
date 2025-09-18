import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';
import { ToastComponent } from '../toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any | null>(null);

  form = this.fb.group({
    username: this.fb.nonNullable.control('user', [Validators.required]),
    password: this.fb.nonNullable.control('user', [Validators.required])
  });

  private decodeJwt(token: string): any | null {
    try {
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
    const val = jwtPayload.AUTHORITIES || jwtPayload.authorities || jwtPayload.roles || jwtPayload.scope;
    if (!val) return [];
    if (Array.isArray(val)) return val.map(String);
    if (typeof val === 'string') {
      // split by space or comma if needed
      return val.includes(',') ? val.split(',').map(s => s.trim()) : val.split(' ').map(s => s.trim());
    }
    return [];
  }

  submit() {
    this.error.set(null);
    this.result.set(null);

    if (this.form.invalid) {
      this.error.set('Please enter username and password.');
      return;
    }

    const { username, password } = this.form.getRawValue();

    this.loading.set(true);
    this.http
      .post('http://localhost:8082/api/auth/login', { username, password })
      .subscribe({
        next: (res) => {
          // Try to extract token from common fields (including id_token from backend)
          const token = (res as any)?.id_token || (res as any)?.token || (res as any)?.accessToken || (typeof (res as any)?.data === 'string' ? (res as any).data : (res as any)?.data?.token);
          if (!token) {
            this.loading.set(false);
            this.error.set('Login succeeded but no token was found in the response.');
            return;
          }

          // Persist the token for later use
          try {
            localStorage.setItem('auth_token', token);
          } catch {}

          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

          // Determine role from JWT
          const payload = this.decodeJwt(token);
          const authorities = this.extractAuthorities(payload);
          const hasAdmin = authorities.includes('ROLE_ADMIN');
          const hasUser = authorities.includes('ROLE_USER');

          if (hasAdmin) {
            // Background admin search call
            this.http.get('http://localhost:8082/api/admin/movies/search', {
              headers,
              params: { keyword: 'batma', page: 1 as any }
            }).subscribe({
              next: (r) => console.debug('[movie search admin] success', r),
              error: (e) => console.debug('[movie search admin] error', e)
            });
            this.loading.set(false);
            this.router.navigate(['home']);
            return;
          }

          if (hasUser) {
            // Background user movies call
            this.http.get('http://localhost:8082/api/user/movies', { headers }).subscribe({
              next: (r) => console.debug('[user movies] success', r),
              error: (e) => console.debug('[user movies] error', e)
            });
            this.loading.set(false);
            this.router.navigate(['user-home']);
            return;
          }

          // Default fallback: treat as normal user
          this.http.get('http://localhost:8082/api/user/movies', { headers }).subscribe({
            next: (r) => console.debug('[user movies fallback] success', r),
            error: (e) => console.debug('[user movies fallback] error', e)
          });
          this.loading.set(false);
          this.router.navigate(['user-home']);
        },
        error: (err) => {
          // Always show static message per requirement
          const userMsg = 'username or password is incorrect';
          this.toast.show(userMsg, 'error', 4500);
          this.error.set(userMsg);
          this.loading.set(false);
        }
      });
  }
}
