import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts()" class="toast" [class.success]="t.type==='success'" [class.error]="t.type==='error'" [class.warning]="t.type==='warning'">
        <div class="msg">{{ t.message }}</div>
        <button class="close" (click)="dismiss(t.id)" aria-label="Close">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;gap:16px;align-items:stretch;z-index:2000}
    .toast{min-width:420px;max-width:640px;width:auto;background:#ffffff;border:1px solid #e0e0e0;box-shadow:0 12px 32px rgba(0,0,0,.2);border-radius:14px;padding:18px 20px;display:flex;align-items:flex-start;gap:14px;font-size:16px;line-height:1.4}
    .toast.success{border-color:#2e7d32}
    .toast.error{border-color:#c62828}
    .toast.warning{border-color:#ed6c02}
    .msg{flex:1;color:#212121;text-align:center}
    .close{appearance:none;border:none;background:transparent;font-size:22px;line-height:1;cursor:pointer;color:#757575}
    .close:hover{color:#424242}
    @media (max-width: 600px){.toast{min-width:auto;max-width:90vw;width:90vw}}
  `]
})
export class ToastComponent {
  private readonly toast = inject(ToastService);
  toasts = computed(() => this.toast.toasts());

  dismiss(id: number) {
    this.toast.dismiss(id);
  }

  show(message: string, type: ToastType = 'info', durationMs = 3000) {
    this.toast.show(message, type, durationMs);
  }
}
