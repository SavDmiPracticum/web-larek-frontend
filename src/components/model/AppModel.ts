import { FormErrors, IBasket, IItem, IOrder, IOrderForm } from '../../types';
import { IEvents } from '../base/events';

export class AppModel {
	protected _catalog: IItem[] = [];
	protected _basket: IBasket = { items: [], total: 0 };
	protected _orderInfo: IOrderForm = {
		address: '',
		payment: '',
		email: '',
		phone: '',
	};
	protected _formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	setCatalog(catalog: IItem[]) {
		this._catalog = catalog;
		this.events.emit('items:loaded');
	}

	get catalog(): IItem[] {
		return this._catalog;
	}

	get order(): IOrder {
		return {
			...this._orderInfo,
			items: this._basket.items.map((item) => item.id),
			total: this._basket.total,
		};
	}

	getItemFromCatalog(id: string): IItem | undefined {
		return this._catalog.find((item) => item.id === id);
	}

	get basket(): IBasket {
		return this._basket;
	}

	setOrderField(field: keyof IOrderForm, value: string): void {
		this._orderInfo[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready');
		}
	}
	setContactsField(field: keyof IOrderForm, value: string): void {
		this._orderInfo[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready');
		}
	}

	validateOrder(): boolean {
		const errors: typeof this._formErrors = {};

		if (!this._orderInfo.payment) {
			errors.address = 'Необходимо указать способ оплаты';
		}

		if (!this._orderInfo.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: typeof this._formErrors = {};
		if (!this._orderInfo.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._orderInfo.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);
		return Object.keys(errors).length === 0;
	}

	resetAll(): void {
		this._orderInfo = {
			address: '',
			payment: '',
			email: '',
			phone: '',
		};
		this._basket = {
			items: [],
			total: 0,
		};
		this.events.emit('items:loaded');
	}

	getItemsCount(): number {
		return this._basket.items.length;
	}

	getItemsBasket(): string[] {
		return this._basket.items.map((item: IItem) => item.id) ?? [];
	}

	addToBasket(item: IItem): void {
		this._basket.items.push(item);
		this._basket.total += item.price ?? 0;
	}

	removeFromBasket(id: string): void {
		this._basket.total -=
			this._basket.items.find((item: IItem) => item.id === id)?.price ?? 0;
		this._basket.items = this._basket.items.filter(
			(item: IItem) => item.id !== id
		);
	}
}
