
export type PayMethod = 'online' | 'offline';
export type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number | null;
}

export interface IItemList {
    total: number;
	items: IItem[];
}

export interface IBasket {
	items: IItem[];
	totalPrice: number;
}

export interface IOrder {
	payment: PayMethod;
	email: string;
	phone: string;
	address: string;
	totalPrice: number;
	items: string[];
}

export interface IOrderSuccess {
	id: string;
	total: number;
}

export interface IApiError {
	error: string;
}

export interface IWebStoreApi {
	getItemList(): Promise<IItemList>;
	getItem(id: string): Promise<IItem>;
	makeOrder(order: IOrder): Promise<IOrderSuccess>;
}

export enum AppEvents {
	ITEMS_LOADED = 'items:loaded',

	ITEM_SELECT = 'item:select',
	ITEM_ADD = 'item:add',
	ITEM_REMOVE = 'item:remove',

	BASKET_OPEN = 'basket:open',
	BASKET_UPDATE = 'basket:update',
	BASKET_CLOSE = 'basket:close',

	ORDER_STEP = 'order:step',
	ORDER_SUBMIT = 'order:submit',
	ORDER_SUCCESS = 'order:success',
	ORDER_ERROR = 'order:error',

	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
}
