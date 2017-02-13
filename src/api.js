import axios from 'axios'

const USER_NAME = 'john'

const baseUrl = 'https://sleepy-thicket-17229.herokuapp.com/api/v1'

export function getBookmarks$() {
  return axios.get(baseUrl+'/bookmarks', {
    params: {
      username: USER_NAME
    }
  })
}

export function postBookmark$(bookmark) {
  return axios.post(baseUrl+'/bookmarks', {...bookmark, ...{
    username: USER_NAME,
  }})
}

export function putBookmark$(bookmark) {
  return axios.put(`${baseUrl}/bookmarks/${bookmark.name}`, {...bookmark, ...{
    username: USER_NAME,
  }})
}

export function deleteBookmark$(bookmarkName) {
  return axios.delete(`${baseUrl}/bookmarks/${bookmarkName}`)
}
