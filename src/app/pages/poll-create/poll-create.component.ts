import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollDto } from '../../models/pollDto';
import { Poll } from '../../models/poll';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-create',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, FooterComponent],
  templateUrl: './poll-create.component.html',
  styleUrl: './poll-create.component.css'
})
export class PollCreateComponent {
  poll: PollDto = {
    title: '',
    description: '',
    allowsMultipleAnswers: false,
    options: ['']
  };

  constructor(private apiService: ApiService, private router: Router) {}

  addOption() {
    this.poll.options.push('');
  }

  removeOption(index: number) {
    if (this.poll.options.length > 1) {
      this.poll.options.splice(index, 1);
    }
  }

  //ENVIAR ENCUESTA
  async submitPoll() {
    try {
      const result = await this.apiService.createPoll(this.poll);

      if (result.success) {
        Swal.fire('Éxito', 'Encuesta creada correctamente', 'success');
        this.poll = { title: '', description: '', allowsMultipleAnswers: false, options: [''] };
        this.router.navigate(['/polls-list']);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la encuesta.', 'error');
    }
  }
  trackByIndex(index: number): number {
    return index;
  }
  
}
