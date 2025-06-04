import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { Poll } from '../../models/poll';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../components/nav/nav.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-polls-list',
  standalone: true,
  imports: [CommonModule, NavComponent, FooterComponent],
  templateUrl: './polls-list.component.html',
  styleUrl: './polls-list.component.css'
})
export class PollsListComponent implements OnInit {
  user: User | null = null;
  polls: Poll[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = this.authService.getUser();
    this.loadPolls();
  }

  async loadPolls(): Promise<void> {
    try {
      const result = await this.apiService.getAllPolls();
      this.polls = result || [];
      console.log('Polls:', this.polls);
    } catch (error) {
      console.error('Error al cargar las encuestas:', error);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToCreatePoll(): void {
    this.router.navigate(['/poll-create']);
  }

  get username(): string {
    return this.user?.name ?? 'Usuario';
  }

  goToPoll(id: number) {
    if (!isNaN(id)) {
      this.router.navigate([`/poll/${id}`]);
    } else {
      console.warn('ID inválido de encuesta:', id);
    }
  }
  
}
