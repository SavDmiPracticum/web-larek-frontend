import { AppEvents, IItem } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { View } from '../base/View';

export interface IMainPage {
	catalog: HTMLElement[];
	counter: number;
	lock: boolean;
}

export class MainPageView extends View<IMainPage> {
	protected _catalog: HTMLElement;
	protected _basket: HTMLElement;
	protected _counter: HTMLElement;
	protected _pageLock: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._pageLock = ensureElement<HTMLElement>('.page__wrapper');
		this._basket.addEventListener('click', () => {
			this.events.emit(AppEvents.BASKET_UPDATE);
			this.events.emit(AppEvents.BASKET_OPEN);
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(value: number) {
		this._counter.textContent = value.toString();
	}

	set lock(value: boolean) {
		this.toggleClass(this._pageLock, 'page__wrapper_locked', value);
		this.toggleClass(this._basket, 'page__wrapper_locked', !value);
	}
}
