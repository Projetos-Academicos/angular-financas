import { Component, OnInit } from '@angular/core';

import { Lancamento } from "../classes/lancamento.model";
import { LancamentoService } from "../classes/lancamento.service";

import * as $ from 'jquery';

import toastr from "toastr";

declare var $: any;

@Component({
  selector: 'app-lista-lancamento',
  templateUrl: './lista-lancamento.component.html',
  styleUrls: ['./lista-lancamento.component.css']
})
export class ListaLancamentoComponent implements OnInit {

  lancamentos: Lancamento[] = [];

  constructor(private lancamentoService: LancamentoService) { }

  ngOnInit() {
    this.lancamentoService.getAll().subscribe(
      lancamentos => this.lancamentos = lancamentos,
      error => alert('Erro ao carregar os lancamentos')
    )
  }

  excluir(lancamento) {
    const confirmarExclusao = confirm('Deseja realmente excluir esse registro?');
    if (confirmarExclusao) {

      this.lancamentoService.excluir(lancamento.id).subscribe(
        () => this.lancamentos = this.lancamentos.filter(element => element != lancamento),
        () => alert('Erro ao tentar excluir')
      )
    }

  }

}
