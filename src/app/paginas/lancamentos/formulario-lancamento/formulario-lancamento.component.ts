import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Lancamento } from "../classes/lancamento.model";
import { Categoria } from "../../categorias/classes/categoria.model";
import { Status } from "../classes/status.model";
import { LancamentoService } from "../classes/lancamento.service";
import { CategoriaService } from "../../categorias/classes/categoria.service";

import { switchMap } from "rxjs/operators";
import * as $ from 'jquery';

import toastr from "toastr";

declare var $: any;

@Component({
  selector: 'app-formulario-lancamento',
  templateUrl: './formulario-lancamento.component.html',
  styleUrls: ['./formulario-lancamento.component.css']
})
export class FormularioLancamentoComponent implements OnInit, AfterContentChecked {

  //VARIAVEIS GLOABAIS

  acao: string;
  formularioLancamento: FormGroup;
  tituloPagina: string;
  serverErrorMessage: any;
  isEnviando: boolean = false;
  lancamento: Lancamento = new Lancamento();
  categorias: Array<Categoria>;
  status: Array<Status>;

  //METODOS PUBLICOS

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  numberConfig = {
    mask: Number
  }

  ptBr = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  constructor(
    private lancamentoService: LancamentoService,
    private route: ActivatedRoute,
    private router: Router,
    private formBiulder: FormBuilder,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.setAcao();
    this.montarFormularioLancamento();
    this.carregarLancamento();
    this.carregarCategorias();
    this.carregarStatus();
    this.disableOrEnableSelect();

  }

  ngAfterContentChecked() {
    this.setPaginaTitulo();
  }

  enviarFormulario() {


    const qntParcelasNull = this.formularioLancamento.get('qntParcelas').value == null || this.formularioLancamento.get('qntParcelas').value == '';
    const vlrParcelasNull = this.formularioLancamento.get('vlrParcelas').value == null || this.formularioLancamento.get('vlrParcelas').value == '';

    if (this.formularioLancamento.get('parcelado').value == true && qntParcelasNull ) {
      toastr.error("Campo Quantidade de Parcelas Obrigatório!");
    }else if(this.formularioLancamento.get('parcelado').value == true && vlrParcelasNull){
      toastr.error("Campo Valor de Cada Parcela Obrigatório!");
    } 
    else {
      
      this.isEnviando = true;

      if (this.acao == "novo") {
        this.criarLancamento();
      } else {
        this.editarLancamento();
      }
    }
  }

  //METODOS PRIVADOS

  private setAcao() {

    if (this.route.snapshot.url[0].path == "novo") {
      this.acao = "novo"
    } else if (this.route.snapshot.url[1].path == "editar") {
      this.acao = "edicao"
    } else {
      this.acao = "visualizacao"
    }
  }

  private montarFormularioLancamento() {
    this.formularioLancamento = this.formBiulder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      descricao: [null, [Validators.required, Validators.minLength(3)]],
      categoria: [null],
      categoriaId: [null, Validators.required],
      valor: [null, Validators.required],
      data: [null, Validators.required],
      parcelado: [false],
      qntParcelas: [null],
      vlrParcelas: [null],
      status: [null],
      statusId: [null, Validators.required],
      despesa: [true, Validators.required]
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
    } else if (this.acao == "edicao") {
      this.tituloPagina = "Atualizar Lancamento"
    } else {
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

  private disableOrEnableSelect() {
    if (this.acao == 'visualizacao') {
      $("#categoriaId").prop("disabled", true);
      $("#statusId").prop("disabled", true);
    }
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

  carregarCategorias() {
    return this.categoriaService.getAll().subscribe(
      categorias => this.categorias = categorias
    )
  }

  carregarStatus() {
    return this.lancamentoService.getAllStatus().subscribe(
      status => this.status = status
    )
  }

}
