import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { LancamentosRoutingModule } from './lancamentos-routing.module';

import { ListaLancamentoComponent } from "./lista-lancamento/lista-lancamento.component";
import { FormularioLancamentoComponent } from "./formulario-lancamento/formulario-lancamento.component";

import { CalendarModule } from "primeng/calendar";
import { IMaskModule } from "angular-imask";

@NgModule({
  declarations: [ListaLancamentoComponent, FormularioLancamentoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LancamentosRoutingModule,
    CalendarModule,
    IMaskModule
  ]
})
export class LancamentosModule { }
