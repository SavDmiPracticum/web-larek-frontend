import { IItem } from '../../types';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';
import { IEvents } from '../base/events';

export class ItemView extends View<IItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _id: string;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
	}

	set id(value: string) {
		this._id = value;
	}
}

export class ItemCatalogView extends ItemView {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _categoryColor = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);

		this.container.addEventListener('click', () =>
			this.events.emit('item:select', { id: this._id })
		);
	}

	set image(value: string) {
		this.setImage(this._image, value, this._title.textContent);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${this._categoryColor[value]}`;
	}
}

export class ItemPreviewView extends ItemCatalogView {
	protected _text: HTMLElement;
	protected _buyButton: HTMLButtonElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);
		this._text = ensureElement<HTMLElement>('.card__text', this.container);
		this._buyButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);

		this._buyButton.disabled = true;
		this._buyButton.textContent = 'Недоступно';

		this._buyButton.addEventListener('click', () => {
			if (this._buyButton.textContent === 'Купить') {
				events.emit('item:add', { id: this._id });
				events.emit('basket:update');
			} else {
				this.events.emit('item:remove', { id: this._id });
				this.events.emit('basket:update');
			}
		});
	}

	set description(value: string) {
		this.setText(this._text, value);
	}

	set inBasket(value: boolean) {
		this._buyButton.disabled = false;
		this._buyButton.textContent = value ? 'Удалить из корзины' : 'Купить';
	}
}

export class ItemBasketView extends ItemView {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);
		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);
		this._deleteButton.addEventListener('click', (evt: MouseEvent) => {
			evt.stopPropagation();
			evt.preventDefault();
			this.events.emit('item:remove', { id: this._id });
			this.events.emit('basket:update');
		});
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}
}
