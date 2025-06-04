import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Poll } from '../../models/poll';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { NavComponent } from '../../components/nav/nav.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, FooterComponent],
  templateUrl: './poll-detail.component.html',
  styleUrl: './poll-detail.component.css'
})
export class PollDetailComponent implements OnInit {
  poll!: Poll;
  selectedOptionIds: number[] = [];
  hasVoted = false;
  userId: number = 0;
  canClosePoll = false;
  isAdmin = false;



  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const result = await this.apiService.get<Poll>(`Poll/${id}`);
  
    if (!result.success || !result.data) {
      Swal.fire('Error', 'Encuesta no encontrada', 'error');
      this.router.navigate(['/polls-list']);
      return;
    }
  
    this.poll = result.data; 
    this.userId = this.apiService.getUserId();

    this.isAdmin = this.apiService.getUserFromStorage()?.role === 'Admin';

    this.canClosePoll = !this.poll.isClosed && this.poll.createdByUserId === this.userId;
  
    const voteCheck = await this.apiService.hasVoted(this.poll.id, this.userId);
    this.hasVoted = voteCheck.success && voteCheck.data === true;
  }
  

  
  onOptionChange(event: Event, optionId: number): void {
    const input = event.target as HTMLInputElement;

    if (this.poll.allowsMultipleAnswers) {
      if (input.checked) {
        this.selectedOptionIds.push(optionId);
      } else {
        this.selectedOptionIds = this.selectedOptionIds.filter(id => id !== optionId);
      }
    } else {
      this.selectedOptionIds = [optionId];
    }
  }


  //ENVIAR VOTO
  async submitVote(): Promise<void> {
    if (!this.selectedOptionIds.length) {
      Swal.fire('Advertencia', 'Debes seleccionar al menos una opción', 'warning');
      return;
    }

    const voteDto = {
      userId: this.userId,
      pollId: this.poll.id,
      selectedOptionIds: this.selectedOptionIds
    };

    const result = await this.apiService.votePoll(voteDto);

    if (result.success) {
      Swal.fire('Gracias', result.data, 'success');
      this.ngOnInit(); 
      this.router.navigate(['/polls-list']);
    } else {
      Swal.fire('Error', result.error || 'No se pudo registrar el voto', 'error');
    }
  }

  //CERRAR ENCUESTA OWNER
  async closePoll(): Promise<void> {
    const result = await this.apiService.closePoll(this.poll.id);
  
    if (result.success) {
      Swal.fire('Encuesta cerrada', result.data, 'success');
      this.ngOnInit(); 
      this.router.navigate(['/polls-list']);
    } else {
      Swal.fire('Error', result.error || 'No se pudo cerrar la encuesta', 'error');
    }
  }
  
  //ELIMINAR ENCUESTA (ADMIN)
  async deletePoll(): Promise<void> {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la encuesta definitivamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirm.isConfirmed) {
      const result = await this.apiService.deletePoll(this.poll.id);
      if (result.success) {
        Swal.fire('Eliminada', 'La encuesta fue eliminada correctamente.', 'success');
        this.router.navigate(['/polls-list']);
      } else {
        Swal.fire('Error', result.error || 'No se pudo eliminar la encuesta.', 'error');
      }
    }
  }
  
}
