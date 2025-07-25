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
	index?: number;
	inBasket?: boolean;
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

	ORDER_DELIVERY = 'order:delivery',
	ORDER_CONTACT = 'order:contact',
	ORDER_SUBMIT = 'order:submit',
	ORDER_ERROR = 'order:error',

	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
}
