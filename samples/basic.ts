import { Basket } from '../samples/basket';
import { Item } from '../samples/item';
import { Action } from '../src/models/action';
import { Store } from '../src/store';

const initialBasket: Basket = { client: '', items: [], status: '' };
const basket$ = new Store<Basket>(initialBasket);

// BASIC USAGE
// get snapshot
const currentBasket: Basket = basket$.getState();
console.log(currentBasket);
// observe changes
basket$.getState$().subscribe({
  next: basket => console.log({ basket }),
});
// observe selected changes
basket$
  .select$(basket => basket.status)
  .subscribe({
    next: status => console.log({ status }),
  });
// setting direct state
basket$.setState({ client: '', items: [], status: 'EMPTY' });

// WHITH ACTIONS
// observe actions
basket$.getActions$().subscribe({
  next: action => console.log({ action }),
});
// dispatch simple action
const setClientAction: Action<Basket> = new Action<Basket>('SET_CLIENT', {
  client: 'John Doe',
  status: 'EMPTY',
});
basket$.dispatch(setClientAction);

// WITH A REDUCER
// dispatch action with payload and reducer
const itemPayload: Item = {
  name: 'An ACME thing',
  units: 19,
  unitPrice: 71,
};
const addItemReducer = (basket: Basket, payload: unknown) => {
  basket.items = [...basket.items, payload as Item];
  basket.status = 'FILLED';
  return basket;
};
const addItemAction: Action<Basket> = new Action<Basket>('ADD_ITEM', itemPayload, addItemReducer);
basket$.dispatch(addItemAction);
