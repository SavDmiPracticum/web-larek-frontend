import { FormErrors, IBasket, IItem, IOrder, IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { BasketModel } from './BasketModel';

export class MainPageModel {
	protected _catalog: IItem[] = [];
	protected _basket: BasketModel;
	protected _order: IOrder = {
		address: '',
		payment: 'online',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};
	protected _formErrors: FormErrors = {};

	constructor(basket: BasketModel, protected events: IEvents) {
		this._basket = basket;
	}

	setCatalog(catalog: IItem[]) {
		this._catalog = catalog;
		this.events.emit('items:loaded');
	}

	get catalog(): IItem[] {
		return this._catalog;
	}

	get order(): IOrder {
		return this._order;
	}

	getItemFromCatalog(id: string): IItem | undefined {
		return this._catalog.find((item) => item.id === id);
	}

	get basket(): BasketModel {
		return this._basket;
	}

	setOrderField(field: keyof IOrderForm, value: string): void {
		this._order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready');
		}
	}
	setContactsField(field: keyof IOrderForm, value: string): void {
		this._order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready');
		}
	}

	validateOrder(): boolean {
		const errors: typeof this._formErrors = {};

		if (!this._order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: typeof this._formErrors = {};
		if (!this._order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderPrice(price: number): void {
		this._order.total = price;
	}

	setOrderItems(items: string[]): void {
		this._order.items = items;
	}

	resetAll(): void {
		this._order = {
			address: '',
			payment: 'online',
			email: '',
			total: 0,
			phone: '',
			items: [],
		};

		this.basket.clear();
		this.events.emit('items:loaded');
	}
}
