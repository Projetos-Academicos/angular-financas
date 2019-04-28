import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Lancamento } from "../classes/lancamento.model";
import { LancamentoService } from "../classes/lancamento.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-formulario-lancamento',
  templateUrl: './formulario-lancamento.component.html',
  styleUrls: ['./formulario-lancamento.component.css']
})
export class FormularioLancamentoComponent implements OnInit, AfterContentChecked {

  acao: string;
  formularioLancamento: FormGroup;
  tituloPagina: string;
  serverErrorMessage: any;
  isEnviando: boolean = false;
  lancamento: Lancamento = new Lancamento();

  constructor(
    private lancamentoService: LancamentoService,
    private route: ActivatedRoute,
    private router: Router,
    private formBiulder: FormBuilder
  ) { }

  ngOnInit() {
    this.setAcao();
    this.montarFormularioLancamento();
    this.carregarLancamento();

  }

  ngAfterContentChecked() {
    this.setPaginaTitulo();
  }

  enviarFormulario() {
    this.isEnviando = true;

    if (this.acao == "novo") {
      this.criarLancamento();
    } else {
      this.editarLancamento();
    }
  }

  //METODOS PRIVADOS

  private setAcao() {

    if (this.route.snapshot.url[0].path == "novo") {
      this.acao = "novo"
    } else if(this.route.snapshot.url[1].path == "editar") {
      this.acao = "edicao"
    }else{
      this.acao = "visualizacao"
    }
  }

  private montarFormularioLancamento() {
    this.formularioLancamento = this.formBiulder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      descricao: [null, [Validators.required, Validators.minLength(3)]],
      categoria: [null, Validators.required],
      valor: [null, Validators.required],
      data: [null, Validators.required],
      isParcelado: [false, Validators.required],
      qntParcelas: [null],
      vlrParcelas: [null],
      status: [null, Validators.required],
      tipo: [null, Validators.required]
    })
  }

  private carregarLancamento() {
    if (this.acao != "novo") {
      this.route.paramMap.pipe(
        switchMap(params => this.lancamentoService.getById(+params.get("id")))
      ).subscribe(
        (lancamento) => {
          this.lancamento = lancamento;
          this.formularioLancamento.patchValue(lancamento); //Bind no formulário da lancamento  após ser consultada
        },
        (error) => alert('Ocorreu um erro no servidor, tente novamente mais tarde.')
      )
    }
  }

  private setPaginaTitulo() {
    if (this.acao == "novo") {
      this.tituloPagina = "Cadastro de Lancamento"
    } else if(this.acao == "edicao") {
      this.tituloPagina = "Atualizar Lancamento"
    }else{
      this.tituloPagina = "Visualizar Lancamento"
    }
  }

  private criarLancamento() {

    const lancamento: Lancamento = Object.assign(new Lancamento(), this.formularioLancamento.value);

    this.lancamentoService.criar(lancamento).subscribe(
      lancamento => this.salvoComSucesso(lancamento),
      error => this.erroAoSalvar(error)
    )
  }

  private editarLancamento() {
    const lancamento: Lancamento = Object.assign(new Lancamento(), this.formularioLancamento.value);

    this.lancamentoService.editar(lancamento).subscribe(
      lancamento => this.salvoComSucesso(lancamento),
      error => this.erroAoSalvar(error)
    )
  }

  private salvoComSucesso(lancamento: Lancamento) {
    if (this.acao == "novo") {
      toastr.success("Lancamento cadastrada com sucesso!");
    } else {
      toastr.success("Lancamento atualizada com sucesso!");
    }
    //Forçar redirecionamento para atualizar o formulário após cadastrar/atualizar uma lancamento
    this.router.navigateByUrl("lancamentos", { skipLocationChange: true }).then(
      () => this.router.navigate(["lancamentos", lancamento.id, "editar"])
    )
  }

  private erroAoSalvar(error) {

    if (this.acao == "novo") {
      toastr.error("Ocorreu um erro ao tentar cadastrar a lancamento.")
    } else {
      toastr.error("Ocorreu um erro ao tentar atualizar a lancamento.")
    }

    this.isEnviando = false;
    this.serverErrorMessage = error.error;

  }

}
