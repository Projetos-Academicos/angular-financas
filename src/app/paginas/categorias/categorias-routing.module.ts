import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaCategoriaComponent } from './lista-categoria/lista-categoria.component';
import { FormularioCategoriaComponent } from './formulario-categoria/formulario-categoria.component';

const routes: Routes = [
  { path: '', component: ListaCategoriaComponent },
  { path: 'novo', component: FormularioCategoriaComponent },
  { path: ':id/editar', component: FormularioCategoriaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
