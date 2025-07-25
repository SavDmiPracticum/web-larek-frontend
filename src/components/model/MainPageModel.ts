import { AppEvents, IBasket, IItem, IOrder } from '../../types';
import { IEvents } from '../base/events';
import { BasketModel } from './BasketModel';
import { OrderModel } from './OrderModel';

export class MainPageModel {
	protected _catalog: IItem[] = [];
	protected _basket: BasketModel;
	protected _order: IOrder = { items: [] };

	constructor(
		basket: BasketModel,
		order: OrderModel,
		protected events: IEvents
	) {
		this._basket = basket;
		this._order = order;
	}

	setCatalog(catalog: IItem[]) {
		this._catalog = catalog;
		this.events.emit(AppEvents.ITEMS_LOADED);
	}

	get catalog(): IItem[] {
		return this._catalog;
	}

	getItemFromCatalog(id: string): IItem | undefined {
		return this._catalog.find((item) => item.id === id);
	}

	get basket(): BasketModel {
		return this._basket;
	}
}
