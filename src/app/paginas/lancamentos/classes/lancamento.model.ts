import { Categoria } from "../../categorias/classes/categoria.model";
import { Status } from "./status.model";

export class Lancamento{
    constructor(
        public id?: number,
        public nome?: string,
        public descricao?: string,
        public categoriaId?: number,
        public categoria?: Categoria,
        public valor?: string,
        public data?: string,
        public parcelado?: boolean,
        public qntParcelas?: number,
        public vlrParcelas?: string,
        public statusId?: number,
        public status?: Status,
        public despesa?: boolean
    ){}

    get despesaText(): string {
        return this.despesa ? 'Despesa' : 'Receita';
    }
}