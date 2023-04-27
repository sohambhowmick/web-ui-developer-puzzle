## Task 1: Code fixes and review

1. Starting from the master branch, create a new branch chore/code-review. - DONE

2. *** CODE SMELLS & IMPROVEMENTS ***
A. Added attribute/field "loading" in reducer function for defining the state of the book loading status. Added required test case.
B. Changed the position of "Want to Read" button and aligned it to below the book cover image for better visual aesthetic, especially when the page is accessed from a small screen sized device.
C. Changed font size for better readability in BookSearchComponent view/HTML.
D. Increased font size of the book content info of each item in "My Reading List". This enhances better usage of space in each row with adequate space between the items for better visual aesthetic.
E. Removed OnInit from TotalCountComponent.
F. Renamed variables and re-formatted code in BookSearchComponent view/HTML and ReadingListComponent view/HTML.
G. Added spinner to be shown while loading books after search.
H. Implemented error handling.

3. *** ACCESSIBILITY ***
A. Added "aria-label" property for <button/>.
B. Added "aria-labelledby" property <img/> tags.
C. Added "title" for <a/> tags.
D. Changed $pink-accent color to #e20074 (T-Mobile color).
E. For "empty" class, changed color from $gray40 to $gray50 and added $gray50 in variables.scss

4. *** UNIT TESTS ***
A. Fixed failing unit tests by adding reducers in reading-list.reducer.ts
B. Added unit test to improve code coverage.
