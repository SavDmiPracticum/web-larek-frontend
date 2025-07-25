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
			this.events.emit('order:cash');
		});
		this._cardButton.addEventListener('click', () => {
			this.payment = 'offline';
			this.events.emit('order:card');
		});
	}

	set payment(value: PayMethod) {
		if (value === 'online') {
			this._cashButton.classList.add('button_alt-active');
			this._cardButton.classList.remove('button_alt-active');
		} else {
			this._cashButton.classList.remove('button_alt-active');
			this._cardButton.classList.add('button_alt-active');
		}
	}
}
