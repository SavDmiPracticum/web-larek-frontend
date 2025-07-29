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
	inBasket?: boolean;
	price: number | null;
	index?: number;
}

export interface IItemList {
	total: number;
	items: IItem[];
}

export interface IBasket {
	items: IItem[];
	totalPrice: number;
}

export interface IOrderForm {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
}

export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export interface IOrderSuccess {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IApiError {
	error: string;
}

export interface IWebStoreApi {
	getItemList(): Promise<IItemList>;
	getItem(id: string): Promise<IItem>;
	makeOrder(order: IOrder): Promise<IOrderSuccess>;
}
