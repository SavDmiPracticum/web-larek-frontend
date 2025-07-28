import {
	AppEvents,
	FormErrors,
	IBasket,
	IItem,
	IOrder,
	IOrderForm,
} from '../../types';
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
	formErrors: FormErrors = {};

	constructor(basket: BasketModel, protected events: IEvents) {
		this._basket = basket;
	}

	setCatalog(catalog: IItem[]) {
		this._catalog = catalog;
		this.events.emit(AppEvents.ITEMS_LOADED);
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

	setOrderField(field: keyof IOrderForm, value: string) {
		this._order[field] = value;
		
		if (this.validateOrder()) {
			this.events.emit(AppEvents.ORDER_READY);
		}
	}
	setContactsField(field: keyof IOrderForm, value: string) {
		this._order[field] = value;

		if (this.validateContacts()) {
			this.events.emit(AppEvents.CONTACTS_READY);
		}
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this._order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this._order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderPrice(price: number): void {
		this._order.total = price;
	}

	setOrderItems(items: string[]): void {
		this._order.items = items;
	}

	resetAll() {
		this._order = {
			address: '',
			payment: 'online',
			email: '',
			total: 0,
			phone: '',
			items: [],
		};

		this.basket.clear();
	}
}
