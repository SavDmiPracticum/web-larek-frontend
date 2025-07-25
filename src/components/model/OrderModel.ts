import { IOrder, IOrderSuccess, PayMethod } from '../../types';

export class OrderModel implements IOrder {
	 payment: PayMethod;
	 email: string;
	 phone: string;
	 address: string;
	 totalPrice: number | null;
	 items: string[];
	 step: number;

	constructor() {
		this.payment = 'online';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.totalPrice = null;
		this.items = [];
		this.step = 1;
	}

	setPayment(payment: PayMethod) {
		this.payment = payment;
	}

	setStep(step: number) {
		this.step = step;
	}

	setTotalPrice(price: number | null) {
		this.totalPrice = price;
	}

	setItems(items: string[]) {
		this.items = items;
	}

	clear() {
		this.payment = 'online';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.totalPrice = null;
		this.items = [];
		this.step = 1;
	}

	submit(): Promise<IOrderSuccess> {
        // TODO логика отправки заказа
		return Promise.resolve({ id: '123', total: 100 });
	}
}
