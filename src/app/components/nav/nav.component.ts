import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, ImageModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit, OnDestroy {
  name: string | null = null;
  userId: number | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

  items: MenuItem[] = [];

  ngOnInit() {
    const user = this.authService.getUser();
    this.name = user?.name ?? null;
    this.userId = user?.userId ?? null;

    this.items = [
      { label: 'Encuestas', routerLink: '/polls-list' },
      { label: 'Crear Encuesta', routerLink: '/poll-create' }
    ];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  authClick() {
    if (this.authService.isAuthenticated()) {
      Swal.fire({
        title: "Has cerrado sesión con éxito",
        text: `¡Hasta pronto ${this.name}!`,
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToProfile(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/user-detail']);
    } else {
      this.router.navigate(['/user-detail']);
    }
  }
}
