import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'categorias', loadChildren: './paginas/categorias/categorias.module#CategoriasModule' },
  { path: 'lancamentos', loadChildren: './paginas/lancamentos/lancamentos.module#LancamentosModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
