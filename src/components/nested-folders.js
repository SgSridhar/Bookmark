import React from 'react'

const NestedFolders = ({bookmarks, title, url, selectedFolder, handleFolderDelete, handleSelectedBookmark}) => {
  return (
    <div className={"nested-folders"}>
      {
        (bookmarks).map((bookmark) => {
          return bookmark.name !== 'uncategorized' ? (
              <div className="folder">
                <div className="name">
                  <span className="glyphicon glyphicon-folder-open" />
                  <div className="bookmark-name">
                    <div className="bookmark">{bookmark.name}</div>
                    <span className="glyphicon glyphicon-trash" data-name={bookmark.name} onClick={handleFolderDelete} />
                  </div>
                </div>
                {(bookmark.bookmarks).map((b) => (
                  <div className="title" data-name={bookmark.name}
                       data-title={b.title} data-url={b.url} onClick={handleSelectedBookmark}>
                    <div className={`${
                      b.title === title &&
                      bookmark.name === selectedFolder && b.url === url ? 'bg' : ''}`}>{b.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              (bookmark.bookmarks).map((b) => (
                <div className="bookmark-uncategorized" data-name={bookmark.name}
                     data-title={b.title} data-url={b.url} onClick={handleSelectedBookmark}>
                  <div className="title">
                    <div className={`${
                      b.title === title &&
                      bookmark.name === selectedFolder && b.url === url ? 'bg' : ''}`}>{b.title}</div>
                  </div>
                </div>
              )))
        })
      }
    </div>
  )
}

// Type checkers are not defined by preact

// NestedFolders.propTypes = {
//   bookmarks: React.PropTypes.arrayOf(React.PropTypes.shape({
//     name: React.PropTypes.string.isRequired,
//     bookmarks: React.PropTypes.arrayOf({
//       title: React.PropTypes.string.isRequired,
//       url: React.PropTypes.string.isRequired,
//     })
//   })).isRequired,
// }

export default NestedFolders
