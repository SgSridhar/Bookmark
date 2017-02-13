import {
  BOOKMARKS_INIT_STATE,
  GET_BOOKMARKS,
  POST_BOOKMARK,
  PUT_BOOKMARK,
  MOVE_BOOKMARK,
  DELETE_BOOKMARK,
  RECEIVE_BOOKMARKS,
  getBookmarks, receiveBookmarks, receiveBookmarksError, moveBookmark, deleteBookmark} from '../actions/bookmarks'
import {getBookmarks$, postBookmark$, putBookmark$, deleteBookmark$} from '../api'

import {Observable} from 'rxjs'

export default function bookmarks(state = BOOKMARKS_INIT_STATE, action) {
  switch(action.type) {
    case RECEIVE_BOOKMARKS:
      return {...state, ...action.payload}

    default:
      return state
  }
}

export function getBookmarksEpic(action$) {
  return action$
    .ofType(GET_BOOKMARKS)
    .switchMap(() => Observable.fromPromise(getBookmarks$()).map(({data}) =>
      receiveBookmarks(data)).catch((err) => Observable.of(receiveBookmarksError(err))))
}

export function postBookmarksEpic(action$) {
  return action$
    .ofType(POST_BOOKMARK)
    .switchMap((action) => Observable.fromPromise(postBookmark$(action.payload)).map(() =>
      getBookmarks()
    ).catch((err) => Observable.of(receiveBookmarksError(err))))
}

export function putBookmarksEpic(action$) {
  return action$
    .ofType(PUT_BOOKMARK)
    .switchMap((action) => Observable.fromPromise(putBookmark$(action.payload)).map(() =>
      getBookmarks()
    ).catch((err) => Observable.of(receiveBookmarksError(err))))
}

export function deleteBookmarkEpic(action$) {
  return action$
    .ofType(DELETE_BOOKMARK)
    .switchMap((action) => Observable.fromPromise(deleteBookmark$(action.payload)).map(() =>
      getBookmarks()
    ).catch((err) => Observable.of(receiveBookmarksError(err))))
}

export function moveBookmarkEpic(action$) {
  return action$
    .ofType(MOVE_BOOKMARK)
    .switchMap((action) => Observable.concat(
      Observable.fromPromise(putBookmark$(action.payload.prev)).map(() =>
        getBookmarks()
      ).catch((err) => Observable.of(receiveBookmarksError(err))),
      Observable.fromPromise(putBookmark$(action.payload.next)).map(() =>
        getBookmarks()
      ).catch((err) => Observable.of(receiveBookmarksError(err)))
    ))
}
