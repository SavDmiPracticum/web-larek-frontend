import {
	IItem,
	IItemList,
	IOrder,
	IOrderSuccess,
	IWebStoreApi,
} from '../../types';
import { Api } from '../base/api';

export class WebStoreApi extends Api implements IWebStoreApi {
	constructor(baseUrl: string, protected cdnUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	getItemList(): Promise<IItemList> {
		return this.get('/product').then((data: IItemList) => ({
			...data,
			items: data.items.map((item: IItem) => ({
				...item,
				image: this.cdnUrl + item.image,
			})),
		}));
	}

	getItem(id: string): Promise<IItem> {
		return this.get(`/product/${id}`).then((item: IItem) => ({
			...item,
			image: this.cdnUrl + item.image,
		}));
	}
	makeOrder(order: IOrder): Promise<IOrderSuccess> {
		return this.post('/order', order).then((data: IOrderSuccess) => data);
	}
}
