import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IOrder, PayMethod } from './../../types/index';
import { FormView } from './FormView';

export class OrderViewAddress extends FormView<IOrder> {
	protected _cashButton: HTMLButtonElement;
	protected _cardButton: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._cashButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.container
		);
		this._cardButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'input[name=address]',
			this.container
		);

		this._cashButton.addEventListener('click', () => {
			this.payment = 'online';
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'online',
			});
		});
		this._cardButton.addEventListener('click', () => {
			this.payment = 'offline';
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'offline',
			});
		});
	}

	set payment(value: PayMethod) {
		if (value === 'online') {
			this.toggleClass(this._cashButton, 'button_alt-active', true);
			this.toggleClass(this._cardButton, 'button_alt-active', false);
		} else {
			this.toggleClass(this._cashButton, 'button_alt-active', false);
			this.toggleClass(this._cardButton, 'button_alt-active', true);
		}
	}

	reset() {
		super.reset();
		this.toggleClass(this._cashButton, 'button_alt-active', false);
		this.toggleClass(this._cardButton, 'button_alt-active', false);
	}
}

export class OrderViewContacts extends FormView<IOrder> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._email = ensureElement<HTMLInputElement>(
			'input[name=email]',
			this.container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'input[name=phone]',
			this.container
		);
	}

	set email(value: string) {
		this._email.value = value;
	}
	set phone(value: string) {
		this._phone.value = value;
	}
}
