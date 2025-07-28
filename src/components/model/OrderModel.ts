import { IOrder, IOrderSuccess, PayMethod } from '../../types';
import { WebStoreApi } from './WebStoreApi';

export class OrderModel implements IOrder {
	payment: PayMethod;
	email: string;
	phone: string;
	address: string;
	total: number | null;
	items: string[];

	constructor() {
		this.payment = 'online';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.total = null;
		this.items = [];
	}

	setPayment(payment: PayMethod) {
		this.payment = payment;
	}

	setTotalPrice(price: number | null) {
		this.total = price;
	}

	setItems(items: string[]) {
		this.items = items;
	}

	clear() {
		this.payment = 'online';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.total = null;
		this.items = [];
	}
}
