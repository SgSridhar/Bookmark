import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'

import bookmarks, {getBookmarksEpic, postBookmarksEpic, putBookmarksEpic, moveBookmarkEpic, deleteBookmarkEpic} from './bookmarks'
import {BOOKMARKS_INIT_STATE} from '../actions/bookmarks'

export const rootReducer = combineReducers({bookmarks})

export const rootEpic = combineEpics(getBookmarksEpic, postBookmarksEpic, putBookmarksEpic, moveBookmarkEpic, deleteBookmarkEpic)

export const initState = {
  bookmarks: BOOKMARKS_INIT_STATE
}
