export class Localidades {
    description: string;
    price: Number;
    amount: Number;
    stock: Number;
    type: string;
    quantity?: Number;
    rows?: Number;
    cols?: Number;
    hide?: boolean;
    tickets?: any[];
    
    constructor(description: string, price: Number, amount: number, stock: number, type: string, quantity?: number, rows?: number, cols?: number ){
        this.description = description;
        this.price = price;
        this.amount = amount;
        this.type = type;
        this.quantity = quantity;
        this.rows = rows;
        this.stock = stock;
        this.cols= cols;
        this.hide = true;
    }
}

    