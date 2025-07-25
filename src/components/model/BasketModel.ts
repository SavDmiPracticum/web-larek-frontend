import { IBasket, IItem } from '../../types';

export class BasketModel implements IBasket {
	protected _items: IItem[];
	protected _totalPrice: number;

	constructor() {
		this._items = [];
		this._totalPrice = 0;
	}

	set items(value: IItem[]) {
		this._items = value;
	}

	set totalPrice(value: number) {
		this._totalPrice = value;
	}

	add(item: IItem): void {
		this._items.push(item);
		this._totalPrice += item.price ?? 0;
	}

	remove(id: string): void {
		this._totalPrice -=
			this._items.find((item: IItem) => item.id === id)?.price ?? 0;
		this._items = this._items.filter((item: IItem) => item.id !== id);
	}

	getItems(): IBasket {
		return { items: this._items, totalPrice: this._totalPrice };
	}

	getItemsBasket(): string[] {
		return this._items.map((item: IItem) => item.id);
	}

	getItemsCount(): number {
		return this._items.length;
	}
}
