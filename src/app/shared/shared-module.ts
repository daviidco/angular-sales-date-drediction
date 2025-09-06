import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Los componentes standalone no van en NgModule
// Se importan directamente donde se usan

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class SharedModule { }
