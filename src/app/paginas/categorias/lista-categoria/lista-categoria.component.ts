import { Component, OnInit } from '@angular/core';

import { Categoria } from "../classes/categoria.model";
import { CategoriaService } from "../classes/categoria.service";

@Component({
  selector: 'app-lista-categoria',
  templateUrl: './lista-categoria.component.html',
  styleUrls: ['./lista-categoria.component.css']
})
export class ListaCategoriaComponent implements OnInit {

  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.categoriaService.getAll().subscribe(
      categorias => this.categorias = categorias,
      error => alert('Erro ao carregar as categorias')
    )
  }

  excluir(categoria) {

    const confirmarExclusao = confirm('Deseja realmente excluir esse registro?');
    if(confirmarExclusao) {

      this.categoriaService.excluir(categoria.id).subscribe(
        () => this.categorias = this.categorias.filter(element => element != categoria),
        () => alert('Erro ao tentar excluir')
      )  
    
    }        
  }

}
