import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LancamentosRoutingModule } from './lancamentos-routing.module';

import { ListaLancamentoComponent } from "./lista-lancamento/lista-lancamento.component";

@NgModule({
  declarations: [ListaLancamentoComponent],
  imports: [
    CommonModule,
    LancamentosRoutingModule
  ]
})
export class LancamentosModule { }
