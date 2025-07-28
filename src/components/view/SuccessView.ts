import { AppEvents, IOrderSuccess } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';
export class SuccessView extends View<IOrderSuccess> {
	protected _description: HTMLElement;
	protected _button_close: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._button_close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._button_close.addEventListener('click', () => {
			this.events.emit(AppEvents.SUCCESS_CLOSE);
			this.events.emit(AppEvents.ITEMS_LOADED);
		});
	}

	set total(value: number) {
		if (value === 0) return;
		this._description.textContent = `Списано ${value} синапсов.`;
	}
}
