import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PollsListComponent } from './pages/polls-list/polls-list.component';
import { PollCreateComponent } from './pages/poll-create/poll-create.component';
import { PollDetailComponent } from './pages/poll-detail/poll-detail.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Ruta pantalla inicio home
    { path: 'login', component: LoginComponent }, // Ruta login
    { path: 'signup', component: SignupComponent }, // Ruta registro
    { path: 'polls-list', component: PollsListComponent}, //Ruta Vista con todas las encuestas
    { path: 'poll-create', component: PollCreateComponent}, //Ruta Vista crear encuesta
    { path: 'poll/:id', component: PollDetailComponent }, // Ruta Vista detalle encuesta
    { path: 'user-detail', component: UserDetailComponent}    //Ruta perfil de usuario
];
