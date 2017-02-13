import R from 'ramda'

export const GET_BOOKMARKS = 'GET_BOOKMARKS'
export const RECEIVE_BOOKMARKS = 'RECEIVE_BOOKMARKS'
export const RECEIVE_BOOKMARKS_ERROR = 'RECEIVE_BOOKMARKS_ERROR'
export const POST_BOOKMARK = 'POST_BOOKMARK'
export const PUT_BOOKMARK = 'PUT_BOOKMARK'
export const MOVE_BOOKMARK = 'MOVE_BOOKMARK'
export const DELETE_BOOKMARK = 'DELETE_BOOKMARK'

export const BOOKMARKS_INIT_STATE = {
  status: 'LOADING',
  data: null
}

export function getBookmarks() {
  return {
    type: GET_BOOKMARKS,
  }
}

export function postBookmark(bookmark) {
  return {
    type: POST_BOOKMARK,
    payload: bookmark,
  }
}

export function putBookmark(bookmark) {
  return {
    type: PUT_BOOKMARK,
    payload: bookmark,
  }
}

export function moveBookmark(bookmark) {
  return {
    type: MOVE_BOOKMARK,
    payload: {
      prev: {
        name: bookmark.prev.name,
        bookmarks: bookmark.prev.bookmarks ? bookmark.prev.bookmarks : [],
      },
      next: bookmark.next
    },
  }
}

export function deleteBookmark(bookmarkName) {
  return {
    type: DELETE_BOOKMARK,
    payload: bookmarkName,
  }
}

export function receiveBookmarks(bookmarks) {
  return {
    type: RECEIVE_BOOKMARKS,
    payload: {
      status: 'LOADED',
      data: bookmarks
    }
  }
}

export function receiveBookmarksError(error) {
  return {
    type: RECEIVE_BOOKMARKS_ERROR,
    payload: {error}
  }
}
