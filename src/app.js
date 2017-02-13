import React from 'react'
import {Provider, connect} from 'react-redux'

import './less/app.less'
import ReactDOM from 'react-dom'

import store from './store'

import NestedFolders from './components/nested-folders'

import R from 'ramda'
import {getBookmarks, postBookmark, putBookmark, moveBookmark, deleteBookmark} from './actions/bookmarks'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newFolder: false,
      title: '',
      url: '',
      moveTo: false,
      selectedFolder: '',
      originalFolder: '',
      selectedBookmark: null,
    }

    this.handleNewFolderClick = this.handleNewFolderClick.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleFolderChange = this.handleFolderChange.bind(this)
    this.handleAddChange = this.handleAddChange.bind(this)
    this.handleFolderDelete = this.handleFolderDelete.bind(this)
    this.handleSelectedBookmark = this.handleSelectedBookmark.bind(this)
    this.handleDeleteBookmark = this.handleDeleteBookmark.bind(this)
    this.handleMoveTo = this.handleMoveTo.bind(this)
  }

  componentWillMount() {
    store.dispatch(getBookmarks())
  }

  componentWillReceiveProps(nextProps) {
    if(!R.equals(nextProps.bookmarks.data, this.props.bookmarks.data)) {
      this.setState({
        newFolder: false,
        title: '',
        url: '',
        selectedFolder: 'uncategorized',
        originalFolder: '',
        selectedBookmark: null,
      })
    }
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    })
  }

  handleUrlChange(e) {
    this.setState({
      url: e.target.value
    })
  }

  handleMoveTo() {
    this.setState({
      moveTo: !this.state.moveTo
    })
  }

  handleNewFolderClick() {
    this.setState({
      newFolder: !this.state.newFolder,
      selectedFolder: '',
    })
  }

  handleFolderChange(e) {
    this.setState({
      selectedFolder: e.target.value
    })
  }

  handleSelectedBookmark(e) {
    this.setState({
      title: e.currentTarget.dataset.title,
      url: e.currentTarget.dataset.url,
      selectedFolder: e.currentTarget.dataset.name,
      originalFolder: e.currentTarget.dataset.name,
    })
  }

  handleAddChange() {
    const bookmark = (this.props.bookmarks.data).find((bookmark) => bookmark.name === this.state.selectedFolder)

    const data = {
      name: this.state.selectedFolder,
      bookmarks: bookmark ? R.concat(bookmark.bookmarks, [{
          title: (this.state.title).trim(),
          url: (this.state.url).trim(),
        }]) : [{
          title: (this.state.title).trim(),
          url: (this.state.url).trim(),
      }]
    }

    if(this.state.moveTo &&
      bookmark && this.state.originalFolder && this.state.selectedFolder !== this.state.originalFolder) {
      const prevBookmark = (this.props.bookmarks.data).find((bookmark) => bookmark.name === this.state.originalFolder)

      return store.dispatch(moveBookmark({
        prev: R.merge(R.reject((b) => (b.title === this.state.title),prevBookmark.bookmarks), {
          name: this.state.originalFolder,
          bookmarks: R.reject((b) => (b.title === this.state.title),prevBookmark.bookmarks),
        }),
        next: data,
      }))
    } else {
      return !bookmark ?  store.dispatch(postBookmark(data)) : store.dispatch(putBookmark(data))
    }
  }

  handleDeleteBookmark() {
    const bookmark = (this.props.bookmarks.data).filter((bookmark) => bookmark.name === this.state.selectedFolder)

    const data = {
      name: this.state.selectedFolder,
      bookmarks: R.reject((b) => b.title === this.state.title, bookmark[0].bookmarks)
    }

    store.dispatch(putBookmark(data))
  }

  handleFolderDelete(e) {
    store.dispatch(deleteBookmark(e.currentTarget.dataset.name))
  }

  render() {
    if(this.props.bookmarks.status === 'LOADING') {
      return (
        <div className="app-container">
          Loading...
        </div>
      )
    }

    const formattedBookmarks = R.reject((b) => b.name === 'uncategorized',this.props.bookmarks.data)
    const filterUncategorized = (this.props.bookmarks.data).find((bookmark) => bookmark.name === 'uncategorized')
    const uncategorizedBookmark = filterUncategorized ? [filterUncategorized] : []

    const bookmarksWithUncategorized = R.concat(formattedBookmarks, uncategorizedBookmark)

    const bookmark = (this.props.bookmarks.data).find((bookmark) => bookmark.name === this.state.selectedFolder)

    const folders = (this.props.bookmarks.data).map((bookmark) => (
        bookmark.name !== 'uncategorized' ? (
        <option value={bookmark.name}>{bookmark.name}</option>
        ) : null
    ))

    const isBookmarkAvailable = ((title, url) => {
      const d = (this.props.bookmarks.data).find((d) => {
        return d.name === this.state.selectedFolder
      })

      if(d) {
        const isSame = (d.bookmarks).find((b) => {
          return (
            (b.title).toLowerCase() === (this.state.title).toLowerCase()
          )
        })

        return isSame ? true : false
      }
      return false
    })(this.state.title, this.state.url)

    const validUrl = (() => {
      const pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/

      if(!pattern.test((this.state.url).trim())) {
        return false
      } else {
        return true
      }
    })()

    return (
      <div className="app-container">
        <div className="add-bookmark-container">
          <div className="add-bookmark">
            <div className="title">
              <label>Title</label>
              <input className="form-control" value={this.state.title} onChange={this.handleTitleChange} type="text"/>
            </div>
            <div className="url">
              <label>URL</label>
              <input className="form-control" value={this.state.url} onChange={this.handleUrlChange} type="text"/>
            </div>
            <div className="move-to">
              <label>Allow Move to:</label>
              <input type="checkbox" value={this.state.moveTo} onChange={this.handleMoveTo} />
            </div>
            <div className="folders">
              {
                !this.state.newFolder ? (
                    <div className="select-folder">
                      <label>{this.state.moveTo ? 'Move To Folder' : 'Select Folder'}</label>
                      <select onChange={this.handleFolderChange} value={this.state.selectedFolder}>
                        <option value='uncategorized'>Select Folder</option>
                        {folders}
                      </select>
                    </div>
                  ) : (
                    <div className="new-folder">
                      <div className="title">
                        <label>Folder Name</label>
                        <input className="form-control" value={this.state.selectedFolder} onChange={this.handleFolderChange} type="text"/>
                      </div>
                    </div>
                  )
              }
            </div>
          </div>
          <div className="action">
            <div onClick={this.handleNewFolderClick} className="btn btn-default">{!this.state.newFolder ? 'New Folder' : 'Choose Folder'}</div>
            {!isBookmarkAvailable ? null : (
                <div onClick={this.handleDeleteBookmark} className="btn btn-default">Delete Bookmark</div>
              )}
            <div className={
              `btn btn-primary ${
                (this.state.title).trim() && (this.state.url).trim() && validUrl && !isBookmarkAvailable ? '' : 'disabled'}`}
                 onClick={this.handleAddChange}>Add Bookmark</div>
          </div>
        </div>
        <div className="bookmarks">
          <NestedFolders
            bookmarks={bookmarksWithUncategorized}
            title={this.state.title}
            url={this.state.url}
            selectedFolder={this.state.selectedFolder}
            handleFolderDelete={this.handleFolderDelete}
            handleSelectedBookmark={this.handleSelectedBookmark}
          />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  bookmarks: React.PropTypes.shape({
    status: React.PropTypes.string.isRequired,
    data: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        bookmarks: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            url: React.PropTypes.string.isRequired,
          }))
      }))
  })
}

const mapStateToProps = ((state) => ({
  bookmarks: state.bookmarks,
}))

const AppContainer = connect(mapStateToProps)(App)

ReactDOM.render(<Provider store={store}><AppContainer /></Provider>, document.getElementById('app'))
