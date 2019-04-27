import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Categoria } from "../classes/categoria.model";
import { CategoriaService } from "../classes/categoria.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-formulario-categoria',
  templateUrl: './formulario-categoria.component.html',
  styleUrls: ['./formulario-categoria.component.css']
})
export class FormularioCategoriaComponent implements OnInit, AfterContentChecked {

  acao: string;
  formularioCategoria: FormGroup;
  tituloPagina: string;
  serverErrorMessages: string[] = null;
  isEnviando: boolean = false;
  categoria: Categoria = new Categoria();

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private formBiulder: FormBuilder
  ) { }

  ngOnInit() {
    this.setAcao();
    this.montarFormularioCategoria();
    this.carregarCategoria();

  }

  ngAfterContentChecked() {
    this.setPaginaTitulo();
  }

  enviarFormulario() {
    this.isEnviando = true;
    
    if (this.acao == "novo") {
      this.criarCategoria();
    } else {
      this.editarCategoria();
    }
  }

  //METODOS PRIVADOS

  private setAcao() {

    if (this.route.snapshot.url[0].path == "novo") {
      this.acao = "novo"
    } else {
      this.acao = "edicao"
    }
  }

  private montarFormularioCategoria() {
    this.formularioCategoria = this.formBiulder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      descricao: [null, [Validators.required, Validators.minLength(3)]]
    })
  }

  private carregarCategoria() {
    if (this.acao == "edicao") {
      this.route.paramMap.pipe(
        switchMap(params => this.categoriaService.getById(+params.get("id")))
      ).subscribe(
        (categoria) => {
          this.categoria = categoria;
          this.formularioCategoria.patchValue(categoria); //Bind no formulário da categoria  após ser consultada
        },
        (error) => alert('Ocorreu um erro no servidor, tente novamente mais tarde.')
      )
    }
  }

  private setPaginaTitulo() {
    if (this.acao == "novo") {
      this.tituloPagina = "Cadastro de Categoria"
    } else {
      this.tituloPagina = "Atualizar Categoria"
    }
  }

  private criarCategoria() {

    const categoria: Categoria = Object.assign(new Categoria(), this.formularioCategoria.value);

    this.categoriaService.criar(categoria).subscribe(
      categoria => this.salvoComSucesso(categoria),
      error => this.erroAoSalvar(error)
    )
  }

  private editarCategoria(){
    const categoria: Categoria = Object.assign(new Categoria(), this.formularioCategoria.value);

    this.categoriaService.editar(categoria).subscribe(
      categoria => this.salvoComSucesso(categoria),
      error => this.erroAoSalvar(error)
    )
  }

  private salvoComSucesso(categoria: Categoria) {
    if (this.acao == "novo") {
      toastr.success("Categoria cadastrada com sucesso!");
    } else {
      toastr.success("Categoria atualizada com sucesso!");
    }
    //Forçar redirecionamento para atualizar o formulário após cadastrar/atualizar uma categoria
    this.router.navigateByUrl("categorias", { skipLocationChange: true }).then(
      () => this.router.navigate(["categorias", categoria.id, "editar"])
    )
  }

  private erroAoSalvar(error) {

    if (this.acao == "novo") {
      toastr.error("Ocorreu um erro ao tentar cadastrar a categoria.")
    } else {
      toastr.error("Ocorreu um erro ao tentar atualizar a categoria.")
    }

    this.isEnviando = false;

    this.serverErrorMessages = JSON.parse(error._body).errors;
  }


}
