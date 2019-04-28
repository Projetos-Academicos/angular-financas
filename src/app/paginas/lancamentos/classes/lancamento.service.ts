import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Lancamento } from './lancamento.model';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  private apiPath: string = "http://localhost:8080/lancamentos";

  constructor(private http: HttpClient) { }

  getAll(): Observable<Lancamento[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamentos)
    )
  }

  getById(id: number): Observable<Lancamento> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamento)

    )
  }

  criar(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post(this.apiPath, lancamento).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamento)
    )
  }

  editar(lancamento: Lancamento): Observable<Lancamento> {
    const url = `${this.apiPath}/${lancamento.id}`;
    return this.http.put(url, lancamento).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamento)
    )
  }

  excluir(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }


  //METODOS PRIVADOS

  private jsonDataToLancamentos(jsonData: any[]): Lancamento[] {
    const lancamentos: Lancamento[] = [];
    jsonData.forEach(element => lancamentos.push(element as Lancamento));
    return lancamentos;
  }

  private jsonDataToLancamento(jsonData: any): Lancamento {
    return jsonData as Lancamento;
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
