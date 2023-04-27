import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';
import {ReadingListItem} from "@tmo/shared/models";

describe('ReadingList Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('init should load initial state', () => {
      const action = ReadingListActions.init();

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(false);
      expect(result.ids.length).toEqual(0);
    });

    it('addToReadingList should should add book to the reading list', () => {
      const action = ReadingListActions.addToReadingList({
        book: createBook('B')
      });
      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B']);
    });

    it('removeFromReadingList should remove book from the reading list', () => {
      const item: ReadingListItem = createReadingListItem('B');
      const action = ReadingListActions.removeFromReadingList({ item });
      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('loadReadingListError should display error', () => {
      const errorMessage = 'Error occurred';
      const action = ReadingListActions.loadReadingListError({ error: errorMessage });
      const result: State = reducer(state, action);

      expect(result.error).toEqual(errorMessage);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
