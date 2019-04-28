import { Categoria } from "../../categorias/classes/categoria.model";

export class Lancamento{
    constructor(
        public id?: number,
        public nome?: string,
        public descricao?: string,
        public categoria?: Categoria,
        public valor?: string,
        public data?: string,
        public isParcelado?: boolean,
        public qntParcelas?: number,
        public vlrParcelas?: string,
        public status?: string,
        public tipo?: string
    ){}

    static tipos = {
        entrada: "Receita",
        dispesa: "Despesa",
    };

    static status = {
        pago: "Pago",
        recebido: "Recebido",
        parcelamento: "Parcelamento",
        futuro: "Futuro"
    };
}