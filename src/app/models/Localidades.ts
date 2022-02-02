export class Localidades {
    description: string;
    price: string;
    amount: number;
    stock: number;
    type: string;
    quantity?: number;
    rows?: number;
    cols?: number;
    hide?: boolean;
    tickets?: any[];
    
    constructor(description: string, price: string, amount: number, stock: number, type: string, quantity?: number, rows?: number, cols?: number ){
        this.description = description;
        this.price = price;
        this.amount = amount;
        this.type = type;
        this.quantity = quantity;
        this.rows = rows;
        this.cols= cols;
        this.hide = true;
    }
}

    