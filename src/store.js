import {createStore, applyMiddleware} from 'redux'
import {createEpicMiddleware} from 'redux-observable'

import {rootReducer, rootEpic, initState} from './reducers/root'

const epicMiddleware = createEpicMiddleware(rootEpic)

const store = createStore(rootReducer, initState, applyMiddleware(epicMiddleware))

export default store


window.store = store
