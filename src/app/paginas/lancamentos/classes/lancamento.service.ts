import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Lancamento } from './lancamento.model';
import { Status } from "./status.model";
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  private apiPath: string = "https://api-finansys.herokuapp.com/lancamentos";
  private apiPathStatus: string = "https://api-finansys.herokuapp.com/status";

  constructor(private http: HttpClient) { }

  getAll(): Observable<Lancamento[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamentos)
    )
  }

  getAllStatus(): Observable<Status[]> {
    return this.http.get(this.apiPathStatus).pipe(
      catchError(this.handleError),
      map(this.jsonDataToStatus)
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
    jsonData.forEach(element => {
      const lancamento = Object.assign(new Lancamento(), element);
      lancamentos.push(lancamento);
    });
    return lancamentos;
  }

  private jsonDataToStatus(jsonData: any[]): Status[] {
    const status: Status[] = [];
    jsonData.forEach(element => {
      const statusAux = Object.assign(new Status(), element);
      status.push(statusAux);
    });
    return status;
  }

  private jsonDataToLancamento(jsonData: any): Lancamento {
    return Object.assign(new Lancamento(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
