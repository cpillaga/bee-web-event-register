export class Localidades {
    description: string;
    price: Number;
    amount: Number;
    stock: Number;
    typeNumbering: string;
    newRecord: string;
    rows?: Number;
    cols?: Number;
    hide?: boolean;
    tickets?: any[];
    
    
    constructor(description: string, price: Number, amount: number, stock: number, typeNumbering: string, newRecord: string, rows?: number, cols?: number ){
        this.description = description;
        this.price = price;
        this.amount = amount;
        this.typeNumbering = typeNumbering;
        this.newRecord = newRecord;
        this.rows = rows;
        this.stock = stock;
        this.cols= cols;
        this.hide = true;
    }
}

    