import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  getBooksLoaded,
  searchBooks
} from '@tmo/books/data-access';

describe('BookSearch Component', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    store.overrideSelector(getAllBooks, [
      { ...createBook('A'), isAdded: false, publishedDate: null },
      { ...createBook('B'), isAdded: false }
    ]);
    store.overrideSelector(getBooksLoaded, true);
    spyOn(store, 'dispatch').and.callFake(() => {});
    store.overrideSelector(getBooksError, null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should dispatch searchBooks when user search with keyword', () => {
    store.overrideSelector(getAllBooks, [
      { ...createBook('A'), isAdded: false, publishedDate: null },
      { ...createBook('B'), isAdded: false }
    ]);

    const searchBox = fixture.debugElement.query(By.css('#search'));
    searchBox.nativeElement.value = 'A';
    searchBox.nativeElement.dispatchEvent(new Event('input'));

    const searchButton = fixture.debugElement.query(By.css('#searchButton'));
    searchButton.nativeElement.click();
    store.refreshState();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: 'A' }));

    const listItems = fixture.debugElement.queryAll(By.css('div.book'));
    expect(listItems.length).toEqual(2);
    expect(component.books.length).toEqual(2);
  });

  it('should dispatch clearSearch when user clear value in search box', () => {
    const searchBox = fixture.debugElement.query(By.css('#search'));
    searchBox.nativeElement.value = '';
    searchBox.nativeElement.dispatchEvent(new Event('input'));

    const searchButton = fixture.debugElement.query(By.css('#searchButton'));
    searchButton.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
  });

  it('should set value in search form and dispatch searchBooks when user click on example text', () => {
    const exampleAnchorTag = fixture.debugElement.query(By.css('a'));
    exampleAnchorTag.nativeElement.click();

    expect(component.searchForm.value.term).toEqual('javascript');
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'javascript' })
    );
  });

  it('should add a book to reading list', () => {
    const book = component.books[0];

    const searchBox = fixture.debugElement.query(By.css('#search'));
    searchBox.nativeElement.value = 'A';
    searchBox.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const addToReadButton = fixture.debugElement.query(By.css('#wantToRead_0'));
    addToReadButton.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book }));
  });

  it('should call search books when user typing', fakeAsync(() => {
    const searchBox = fixture.debugElement.query(By.css('#search'));
    searchBox.nativeElement.value = 'BA';
    searchBox.nativeElement.dispatchEvent(new Event('input'));
    tick(500);
    expect(component.searchForm.value.term).toEqual('BA');
  }));

  it('should display error when user given invalid data', fakeAsync(() => {
    store.overrideSelector(getBooksError, {
      error: { message: 'Error occurred' },
    });
    store.overrideSelector(getAllBooks, []);

    const searchBox = fixture.debugElement.query(By.css('#search'));
    searchBox.nativeElement.value = 'BA';
    searchBox.nativeElement.dispatchEvent(new Event('input'));
    tick(500);

    store.refreshState();
    fixture.detectChanges();

    expect(component.searchForm.value.term).toEqual('BA');
    expect(component.errorMessage).toEqual('Error occurred');
    expect(component.books.length).toEqual(0);
  }));
});
