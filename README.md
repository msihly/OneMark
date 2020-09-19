# What is OneMark?
### [OneMark](https://onemark.herokuapp.com) is an image-based bookmark organizer designed for cross-platform use with a modern, responsive interface. Make sure to install the [Add-On extension for Chrome](https://chrome.google.com/webstore/detail/onemark/cjklnajnighcegajggjfmjecfidllinm) for a proper experience.

&nbsp;

### Create and edit bookmarks with a title, link, and an optional image and tags :
![Bookmark editor example](/images/editor.jpg)

### Search your collection with a fast and comprehensive search engine :
![Search example](/images/search.jpg)

### Quickly sort your bookmarks by title, date created or modified, number of views, or image size :
![Bookmark sorting example](/images/sort.jpg)

### View bookmark metadata not found in the editor via the bookmark dropdown menu :
![Bookmark sorting example](/images/info.jpg)

#### If you have any suggestions, issues to report, or other general comments, please feel free to use the appropriate sections of the GitHub repository or contact me at mohamed.sihly@gmail.com. Thank you for your interest.

---
&nbsp;

# Changelog
## Version 2.04 &nbsp;-&nbsp; (2020-09-18)
* Added multi-select functionality to bookmarks
    * A checkbox will now appear on hovering over the top-left of a bookmark
        * Clicking the checkbox will bring up the multi-select bar at the bottom of the screen
        * Updated checkbox component to support additional functionality and prevent click-through behavior
    * Current options are "Edit Tags", which will bring up the new multi-tag editor ("tagger") and "Unselect All"
* Abstracted error handling on server and fixed existing related helper functions
* Added new utility functions for client and server
* Minor fixes to SCSS classes
* Minor reorganization of reducer and action files for clarity (will be further improved in future release with addition of Redux Toolkit)

## Version 2.03 &nbsp;-&nbsp; (2020-09-09)
* Fixed date-related inconsistencies between client and server
* Fixed duplicate toasts on bookmark creation
* Fixed missing image size data after editing bookmark

## Version 2.02 &nbsp;-&nbsp; (2020-09-09)
* Added custom 404 page
* Fixed controlled inputs jumping to end of line on input

## Version 2.01 &nbsp;-&nbsp; (2020-08-24)
* Re-added ability to open bookmark on middle-click / scroll-wheel click

## Version 2.00 &nbsp;-&nbsp; (2020-08-17)
* Official release of the React (Create-React-App) / Node (Express) edition of OneMark. See the [OneMark-Original-Public repository](https://github.com/msihly/OneMark-Original-Public) for the original version of OneMark (last revision 1.02) built using vanilla HTML5, CSS3, JavaScript, and PHP. The existing changelog has been appended below for consolidated reference.
* Toast system changed to use the [React-Toastify](https://github.com/fkhadra/react-toastify) library
    * InlineMessage functionality replaced with toasts
* Removed debouncing on searchbar due to complexity of integration with React (the debounce function of Lodash works more seamlessly; however, the additional footprint of the library is not worth this sole purpose)

---
## Version 1.02 &nbsp;-&nbsp; (2020-06-12)
* Fixed incomplete query in `updateProfile(...)` in `db-functions.php` causing updates to all rows

## Version 1.01 &nbsp;-&nbsp; (2020-06-06)
* Compressed repetitive variable assignment in `searchBookmarks()` even further using destructuring and mapping
* Fixed typo in function call on register page throwing fatal error

## Version 1.00 &nbsp;-&nbsp; (2020-06-05)
* Restructured global objects and references
* Redesigned various UI elements
    * Homepage changed to dark mode (light mode will return as an alternative at a later date)
    * Modals updated with cleaner designs
    * Transparent input style with animated label moved from default styling on inputs to its own classes (currently no longer used on homepage, only on login page)
    * 'Upload Image' button on bookmark create / edit modals now changes to 'Remove Image' if an image is uploaded or already exists
        * Removed 'Remove Image' button
        * Bookmark edit modal now checks if the bookmark has an image and updates the 'Upload Image' button on modal open
        * Button now takes up full available space at all viewport dimensions
        * Removed `fileUpload()` and `removeUpload()` and restructured functionality into `uploadFile()` and `updateFileInput()`
    * Bookmark create / edit modals now convert from a row structure to a column structure on mobile
    * Bookmarks now have a minimal semi-transparent black border to better differentiate between bookmarks with similar images
    * Changed bookmark outer and title elements from `div` to `figure` and `figcaption` elements for improved semantics
    * Changed buttons using `a` tags on 'login' / 'register' to `span` tags for improved semantics
* Fixed issues resulting from incorrect ordering on some `querySelectorAll` destructuring combinations
* Updated 'Account' modal with ability to change username and email
    * Added supporting functionality to `update-profile.php` *(formerly `update-pass.php`)* and `db-functions.php` to change username, email, or password
    * Changed `updatePassword()` to `updateProfile()` in `home.js` and merged former functionality with new username and email functionality
    * Updated `modalAccount()` in `home.js` to only call `php/account-info.php` and store it in the global object if it's not already stored, which reduces needless server calls every time the modal is opened
* Overhauled bookmark search
    * Added 'Advanced Search' dropdown UI
        * Can add terms in the form of [Anything || Title || URL || Tag] + [contains || does not contain]
        * Match words in either AND or OR form
        * Match partial words or whole words only
        * Collapses to column view on mobile
        * Added `addSearchTerm()` to `home.js` to add terms to searchbar and then call `searchBookmarks()`
    * Updated `searchBookmarks()` - revised regular expression creation and testing to allow for negated searches and more complex combinations
* Merged `hideTags(...)` and `showTags(...)` into `displayTags(...)` in `home.js`
* Added `emptyContainer(...)` to `common.js` for emptying container elements of their children
* Added `closeMenu(...)` to `common.js` to close a specific menu
* Added `selectDropdown()` to `common.js` to support custom-styled dropdown menus (replacement for `select` and `option` html tags)
* Renamed `printDate(...)` to `formatDate(...)` in `common.js`
* Updated `closeMenus(...)` and `toggleMenu(...)` to allow prevention of parent menu closure when opening child menus, such as the dropdowns on the 'Advanced Search' menu

## Version 0.90 &nbsp;-&nbsp; (2020-05-22)
* Updated `.htaccess` to hide file extensions and use `DirectoryIndex`
    * `index.php` renamed to `home.php`
* Created `common.css` by extracting elements common to different pages / projects
    * Each page now has a specific stylesheet, i.e. `home.css` and `login.css`
* Updated all JavaScript files to use ES6 consistently, cleanup functions and global scope, and extract common functions
    * Functions and object properties reordered lexicographically
    * Global variables all placed into single file-specific global `const`
    * Replaced all uses of `var` keyword with `let` and `const`
    * Shortened frequently used and unncessarily long variable names while expanding more specific names to make their purpose clearer
    * `home.js` functions `regexEscape(...)`, `formatBytes(...)`, `closeMenus()`, `toggleMenu()`, `modalClose(...)`, and `createAlert(...)` extracted to `common.js` module
* Updates to `home.js`
    * `sortBookmarks()` now persists sort method using localStorage
    * Removed `activeBookmarks` variable and references to it as it was proactively created in an early version for a potential feature that no longer requires it
    * Abstracted part of `bookmarksEmpty(...)` to new `checkEmpty(...)` in `common.js` module
    * Bookmarks can now additionally be opened by clicking the scrollwheel
* Updates to `common.js`
    * Added `capitalize(...)`, `checkEmpty(...)`, `leadZeros(...)`, and `printDate(...)` functions
    * Renamed `insertInlineMessage(...)` to `inlineMessage(...)`
* Fixed registration bug associated with AuthTokens
* Removed `php/restricted/db-steup.php`

## Version 0.81 &nbsp;-&nbsp; (2020-03-25)
* Created privacy policy page to comply with Chrome Web Store requirement for listing OneMark extension
* Tidied up some elements of `stylesheet.css` (in-progress; will extract common elements to a `common.css` stylesheet and create page-specific stylesheets)

## Version 0.80 &nbsp;-&nbsp; (2020-03-10)
* Added supporting API files and functions for the new OneMark extension
    * Added `ext-add-bookmark.php`, a custom version of `add-bookmark.php` for extension requests
    * Added `ext-login.php`, a custom version of `login.php` for extension requests
    * Added `bookmarkExists(...)` function to `db-functions.php` for server-side validation
    * Updated `.htaccess` to allow origin requests from extension and `Authorization` headers
* Replaced unicode characters with their codes for improved reliability
* Updated `async / await` statements to reduce from 2 lines to 1 line per `fetch` call
    * Bookmark info content abstracted from `createBookmark()` to `getBookmarkInfo(...)`
* Updated `insertInlineMessage(...)` function of `Common` module to be simpler and support more options
    * Can now set a duration for messages to be deleted after
* Updated constraints on `title` and `pageURL` fields for bookmarks
    * Updated validity checks in `isValid(...)` function of `Common` module
    * Updated validity checks in `add-bookmark.php` and `edit-bookmark.php`
* Updated AuthToken duration from 14 days to 30 days
* Fixed error in info modals for bookmarks not updating without refreshing page
* Fixed pathing issue in `logging.php` when included from a different directory
* Fixed bookmarks with no image not receiving the new `ImageSize` property in `upload.php`

## Version 0.73 &nbsp;-&nbsp; (2020-02-08)
* Fixed AuthToken bug caused by cookie being set to directory instead of domain

## Version 0.72 &nbsp;-&nbsp; (2020-02-08)
* Fixed mobile-responsiveness of modals, font-sizes, and scrollable menus

## Version 0.71 &nbsp;-&nbsp; (2020-02-08)
* Fixed incorrect URL validation RegEx by replacing with AngularJS's RegEx
* Fixes for undesired behavior involving tag search visual displays
    * Fixed tag search button incorrect resizing on different screen sizes and variance in text-width
        * Tag search label has been removed and the placeholder on the search input has been re-enabled
    * Search field is now cleared when the tag search button is activated upon adding or removing a tag
* Fixed bugs in `searchBookmarks()` function

## Version 0.70 &nbsp;-&nbsp; (2020-02-02)
* Hotfix of critical errors in `modalClose()` function
* Converted fat-arrow notation for anonymous functions requiring an `event` or `this` reference back to original notation
* Updated sort-menu buttons
    * Order changed to reflect most likely desired sorting attributes in descending order
    * Changed default query sort in `getAllBookmarks()` function in `db-functions.php` to *'DateModified'* descending
    * Added indicator of currently selected sort

## Version 0.69 &nbsp;-&nbsp; (2020-02-02)
* Added *'Image Size'* sort option
    * Added `ImageSize` column to `Images` db-table
* Added dynamic alert modals with `createAlert()`
    * The minimum required to deliver a proper front-end experience has been implemented with aspects hard-coded as necessary to prevent excessive focus on recreating a feature with several established, extensive libaries that can be implemented in prodctuion
    * *'Info'* option added to bookmark dropdown menus to display metadata info (Date Created, Date Modified, View Count, Image Size)
        * Added `formatBytes()` function to `home.js` to pretty-print *'Image Size'*
    * Updated `modalClose()` function to support optional deletion of modal
* Added *'Account'* option, which opens a dynamic tabbed modal, to side-menu
    * Account info tab currently contains username, email, date account created, and account type
        * Created `account-info.php` and added associated functions to `db-functions.php`
    * Password tab allows updating current password
        * Created `update-pass.php` and added associated functions to `db-functions.php`
        * Added `updatePassword()` function to `home.js`
        * Updated `isValid()` function to support comparison of current password to new password
    * Moved `switchPanel()` function from `login.js` to `common.js`
    * Added `swtichTab()` function to `common.js` to support tabbed-panels
* Fixed undesired behavior of input title and error labels when not using reversed column order
* Fixed AuthToken login bug caused by previous change from fetching full `login.php` in JS to in-line php session check
* Fixed `randomizeTheme()` bug causing same theme to be picked consecutively
    * Added `getRandomInt()` function to `common.js` module to facilitate recursive random integer generation
* Consolidated global variables in `common.js` and `login.js` into singular global objects
    * Renamed `Globals` object in `home.js` to `IdxGlobals` and added similar prefixes to the new globals to prevent naming clashes
* Renamed JavaScript and HTML/PHP files to make the *'main'* page the index page
    * The former `index.php` (containing the login page) is now `login.php`
    * The former `main.php` (containing the main site) is now `index.php`, and `main.js` is now `home.js`

## Version 0.68 &nbsp;-&nbsp; (2020-01-29)
* Merged upload- and edit-bookmark modals into one dynamic modal
    * Removed several extraneous element attributes related to differentiating between elements on edit and upload modals
    * Modified functions, event listeners, and global variables associated with previous configuration to now directly reference the unique elements on the bookmark-modal instead of dynamically creating IDs
* Fixed `IntersectionObserver` implementation, which only observed images created at window load and not newly created bookmarks
    * Observer is now created as a global variable and bookmark images are observed upon creation in `createBookmark()` instead of all at once on window load
* Consolidated global variables (excluding `lazyObserver`) into single global object `Globals`
* Rewrote `addListeners()` function in `common.js` to simplify structure, consolidate repeated code, and add support for classes as identifiers
* Updated `common.js` to use string literals
* Added bookmark sorting functionality
    * Sort options include Title, Views, Date Created, and Date Modified with an ascending and descending option for each
    * Added `Views` column (default = 0) to `Bookmarks` db-table to support new sort type
    * Added `add-view.php` file for asynchronus incrementation of bookmark view count
    * Updated navbar HTML structure and CSS styling to support new *'Sort'* menu
* Moved `db-functions.php` and `logging.php` to restricted folders as they should not be directly accessible by users

## Version 0.67 &nbsp;-&nbsp; (2020-01-24)
* Added *'Remove Image'* button to edit- and upload-bookmark modals
* Added lazy-loading of bookmark images using the `IntersectionObserver` API
* Revised ID and class naming schemes in HTML and CSS to shorten repetitive lengthy names
* Revised image folder structure on account of previous changes to separation of static and dynamic images
* Updated favicon to new custom OneMark logo
* Updated `insertInlineMessage()` to fade-in over 1 second
* Fixed portions of mobile-responsive CSS (requires further testing)
* Relegated unused images and design files to subfolders ignored in `.gitignore`

## Version 0.66 &nbsp;-&nbsp; (2020-01-18)
* Replaced `page-load.js` module and `page-load.php` with in-line PHP to remove noticeable delay
    * Changed `index.html` and `main.html` all references in JS and PHP files to use `.php` extensions
    * Use PHP `header()` instead of JS `window.location.href` to redirect immediately without executing following code
* Modified `get-bookmarks.php` to reduce page loading lag
    * Moved assignment of bookmark-tags to `getAllBookmarks()` function
    * Replaced foreach loop calling `getBookmarkTag()` on each bookmark in `getAllBookmarks()` to get all bookmark-tags for selected user at once
        * Looped through all tags retrieved to check if `BookmarkID` matches and add tags to `Tags` field of returned bookmarks array
        * Script execution reduced from average of ~~`~160ms` to `~90ms`~~ *(measured on local environment; production enviroment down from `~90ms` to `~40ms`)*
* Replaced `window.onload` with `DOMContentLoaded` event listener in `index.php` and `main.php`

## Version 0.65 &nbsp;-&nbsp; (2020-01-14)
* Added monitoring plug-in to Heroku to keep dyno active 24/7
    * Achieved with NewRelic Synthetics ping option at an interval of 15 minutes

## Version 0.64 &nbsp;-&nbsp; (2020-01-12)
* Fixed critical error in `createTag()` caused by `querySelector` processing speed
    * Switched `querySelector` call to `getElementById` for proper sequential declaration
    * Updated tag HTML structure to include another ID for the `getElementById` call
* Modified `createBookmark` to replace `createElement`s with ES6 string literal for improved readability and updating
    * Contextual fragment used to add event listeners
* Updated `main.js` and `login.js` to use string literals instead of concatenation
* Fixed error in `RegExp` creation in `searchBookmarks()` causing bookmarks with spaces in any of their properties to be incorrectly displayed at all times
* Updated `searchBookmarks()` to use ES6 destructuring assignment and `map()` array function in place of repetitive code where applicable
* Updated `db-connect.php` to use environment variables instead of hardcoded database credentials
* Updated `main.js` and `login.js` to use string literals instead of concatenation

## Version 0.63 &nbsp;-&nbsp; (2020-01-10)
* Created `page-load.js` to solve issue of page flicker between login and main pages
    * Script runs before loading DOM using `defer` tag and checks for user status via PHP
    * Flickering has not been fixed
        * Priority assigned to *Completed*; however, the task is essentially assigned the lowest priority for revision
        * Flickering of bookmarks now occurs due to delay introduced by having to use AWS S3 instead of the local filesystem; however, impact is negligible due to memory caching
        * Highest impact on page load times now reassigned to `get-bookmarks.php` and `login.php`

## Version 0.62 &nbsp;-&nbsp; (2020-01-10)
* Due to the nature of Heroku's ephemeral file storage system, the storage of uploaded images needed to be switched to a persistent storage server
    * The free tier of Amazon S3 is being used for 5GB of image storage
        * IAM user given `*list`, `*read`, `*write`, and `PutObjectACL` permissions
    * Load AWS SDK
        * AWS SDK installed using `composer.json`
        * Bucket name and S3 credentials stored in and retrieved from Heroku configuration variables
    * Update `upload.php` file to use Amazon S3 bucket instead of local filesystem
        * Image paths and urls modified to use quasi-directories to account for flat architecture

## Version 0.61 &nbsp;-&nbsp; (2020-01-09)
* Hotfix of incorrect commit resulting in old files not being removed

## Version 0.60 &nbsp;-&nbsp; (2020-01-09)
* Partial rewrite of database to isolate images to their own table with a relationship to the `Bookmark` table
* Store image hashes from PHP in database `Images` table with a unique index constraint to search for duplicate images on upload and set image paths to existing images instead of reuploading or overwriting them
* Extensive rewrite of PHP files to abstract all database-related functions and merge with the AuthTokens module to create the `db-functions.php` file for one comprehensive `include`
* Removed `.menu-toggle` sub-elements to replace with pseudo-elements
    * Updated design definitions to more standard practices
    * Updated modal-close buttons to follow the same design practices
* Access to sensitive PHP files restricted to server-only via .htaccess configuration
* Abstraction of common functions to `common.js` module using `import` and `export` API
* Form validation / restrictions via HTML, JS, and PHP for forms on login and main pages
    * Temporary toasts replaced with new error labels adjacent to form fields
* Align minimum and maximum values for JS / PHP input with values in database
* Search bookmarks using regular expressions
    * Filter by title, url, and tags using the form `[type]:` for prefixes
        * Toggle AND/OR for terms
        * Toggle full-word for terms
    * Associated helper functions for removing, hiding, and showing bookmarks
    * General debouncing function to limit search calculations
* Bookmark tagging system implemented and completed
    * Many-to-many relationship between `Bookmark` and `Tag` tables using `BookmarkTag` bridge table
    * On bookmark upload / edit, tags are compared to existing tags and added or removed from the `BookmarkTag` table. Tags are added to the `Tag` table if they do not exist
    * Upload and edit modals redesigned to include a tags container
        * Search field with inline-button that shows as "x" when the tag is in the list and "+" otherwise
        * Box below search with rows listing tags with "x" buttons next to them
* Cleaned up and updated JS code to use more ES6 elements (arrow functions, ternary and spread operators, destructuring assignment, etc.)
* Added `AccessLevel` column to `User` database table for potential future uses
    * Check when requesting access to restricted files and functions
    * Add `Standard` and `Admin` for development; add `Premium` in production
* Updated bookmark image hover animation to move along both dimensions
    * To account for jittering introduced by minimal movements on the x-axis, the duration has been reduced from `5s` to `2s` and the timing function has been changed to `linear`
    * To return the animation to the center without modifying the `keyframes` definition of `movePosition`, the iteration count has been increased from `2` to `2.5`
* Transferral of To-Do-List from `main.js` to `readme.md`
    * Consolidation of To-Do-List and GitHub commit changelogs into one entity
    * Retroactive updates to To-Do-List and changelogs to improve information granularity, consistency, and formatting

## Version 0.51 &nbsp;-&nbsp; (2019-10-01)
* Hotfix for graphical issues caused by improper commit

## Version 0.50 &nbsp;-&nbsp; (2019-10-01)
* Complete visual redesign to a consistent, material design
* Mobile responsiveness added where relevant (not including touch features)
* Navigation bar added to contain miscellaneous buttons and future features
* Updates of JS and PHP corresponding with redesign
* Authentication tokens / "Remember Me" functionality fully implemented
* Code cleanup and optimization
* Improved to-do-list organization

## Version 0.40 &nbsp;-&nbsp; (2019-08-26)
* Token authentication and persistent login system added
* Logging system added (primarily for development debugging)
* Cleaned up interactions between JS and PHP to show users appropriate messages and redirect to the correct locations
* New functions added in PHP and JS along with optimizations and code cleanup

## Version 0.30 &nbsp;-&nbsp; (2019-07-21)
* Creation of Database and PHP Scripts
* Updates to HTML Structure
* Minor modifications to CSS
* Sweeping shanges to Javascript core functions and introduction of new functions in correspondance with introduction of PHP scripts

## Version 0.20 &nbsp;-&nbsp; (2019-02-10)
* Initial commits of existing files