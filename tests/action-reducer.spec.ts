import { take } from 'rxjs/operators';
import { Basket } from '../samples/basket';
import { Action } from '../src/models/action';
import { Store } from '../src/store';

describe('An store that dispatches new state with actions', () => {
  const dummyInitialState = { client: '', items: [], status: '' };
  let sut: Store<Basket>;
  beforeEach(() => {
    // Arrange
    sut = new Store<Basket>(dummyInitialState);
  });
  it('should accept payload actions as new state', () => {
    // Act
    const dummyAction = new Action<Basket>(
      'ADD_CLIENT',
      {
        client: 'dummy action change',
        status: 'EMPTY',
      },
      (state, payload) => {
        state.client = payload.client;
        return state;
      }
    );
    sut.dispatch(dummyAction);
    let actual;
    sut
      .getState$()
      .pipe(take(1))
      .subscribe({
        next: state => (actual = state),
      });
    // Assert
    const expected = { client: 'dummy action change', items: [], status: '' };
    expect(actual).toStrictEqual(expected);
  });
  it('should emit the processed actions for instrumentation or effects', () => {
    // Act
    const dummyAction = new Action<Basket>('ADD_CLIENT', {
      client: 'dummy action change',
      items: [],
      status: '',
    });
    sut.dispatch(dummyAction);
    let actual;
    sut
      .getActions$()
      .pipe(take(1))
      .subscribe({
        next: state => (actual = state),
      });
    // Assert
    const expected = new Action<Basket>('ADD_CLIENT', {
      client: 'dummy action change',
      items: [],
      status: '',
    });
    expect(actual ? actual['type'] : null).toStrictEqual(expected.type);
    expect(actual ? actual['payload'] : null).toStrictEqual(expected.payload);
  });
});
