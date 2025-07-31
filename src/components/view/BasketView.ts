import { IBasket } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { View } from '../base/View';

export class BasketView extends View<IBasket> {
	protected _basketList: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _buyButton: HTMLButtonElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._totalPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this._buyButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._buyButton.addEventListener('click', () => {
			this.events.emit('order:start');
		});
	}

	set basketList(value: HTMLElement[]) {
		if (value.length === 0) {
			this.setDisabled(this._buyButton, true);
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		} else {
			this.setDisabled(this._buyButton, false);
			this._basketList.replaceChildren(...value);
		}
	}

	set totalPrice(value: number) {
		this.setText(this._totalPrice, `${value} синапсов`);
	}
}
