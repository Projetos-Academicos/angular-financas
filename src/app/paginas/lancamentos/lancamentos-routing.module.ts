import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaLancamentoComponent } from "./lista-lancamento/lista-lancamento.component";
import { FormularioLancamentoComponent } from "./formulario-lancamento/formulario-lancamento.component";

const routes: Routes = [
  { path: '', component: ListaLancamentoComponent },
  { path: 'novo', component: FormularioLancamentoComponent },
  { path: ':id/editar', component: FormularioLancamentoComponent },
  { path: ':id/visualizar', component: FormularioLancamentoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentosRoutingModule { }
