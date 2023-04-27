import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  getBooksLoaded,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  showSpinner = false;
  errorMessage = '';
  private unSubscribe: Subject<string> = new Subject();

  searchForm: FormGroup = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.getAllBooks();
    this.getBooksLoaded();
    this.getBooksError();

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unSubscribe)
      )
      .subscribe(() => {
        this.searchBooks();
      });
  }

  formatDate(date: void | string): string {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample(): void {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks(): void {
    this.errorMessage = '';
    if (this.searchForm.value.term) {
      this.books = [];
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  getAllBooks() {
    this.store
      .select(getAllBooks)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(books => {
        this.books = books;
      });
  }

  getBooksLoaded() {
    this.store
      .select(getBooksLoaded)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(isLoaded => {
        this.showSpinner = !isLoaded;
      });
  }

  getBooksError() {
    this.store
      .select(getBooksError)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(error => {
        if (error && error['error']) {
          this.errorMessage = error['error'].message;
        }
      });
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
