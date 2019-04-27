import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { CategoriasRoutingModule } from './categorias-routing.module';
import { ListaCategoriaComponent } from './lista-categoria/lista-categoria.component';
import { FormularioCategoriaComponent } from './formulario-categoria/formulario-categoria.component';

@NgModule({
  declarations: [ListaCategoriaComponent, FormularioCategoriaComponent],
  imports: [
    CommonModule,
    CategoriasRoutingModule,
    ReactiveFormsModule
  ]
})
export class CategoriasModule { }
