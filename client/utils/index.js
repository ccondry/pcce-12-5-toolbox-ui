import axios from 'axios'

export const load = function (instance, jwt, endpoint, query) {
  console.log('GET', endpoint)
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
  }
  return axios.get(endpoint, options)
}

export const put = function (instance, jwt, endpoint, query, data) {
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
  }
  return axios.put(endpoint, data, options)
}

export const post = function (instance, jwt, endpoint, query, data) {
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
  }
  return axios.post(endpoint, data, options)
}

export const httpDelete = async function (instance, jwt, endpoint, query) {
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
  }
  return axios.delete(endpoint, options)
}

export const formatUnicorn = function () {
  // first arg is the string
  let str = arguments[0]
  for (let i in arguments) {
    if (i !== 0) {
      // following args are the replacements
      str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gi'), arguments[i])
    }
  }

  return str
}

// helper function to append query parameters to a URL for fetch
export const addUrlQueryParams = function (endpoint, params) {
  let url = endpoint
  if (typeof params === 'object') {
    // append URL query paramenters
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = params[key]
      if (i === 0) {
        url += '?'
      } else {
        url += '&'
      }
      url += encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
  }
  return url
}

export const fetch = async function (url, options = {}) {
  if (!url) {
    throw Error('url is a required parameter for fetch')
  }
  // set content type to JSON by default
  options.headers = options.headers || {}
  options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'

  // stringify body if object
  if (typeof options.body === 'object') {
    options.body = JSON.stringify(options.body)
  }
  // console.log('fetch', url, options)
  // add query parameters to URL
  try {
    // console.log('url', url)
    const endpoint = addUrlQueryParams(url, options.query)
    // console.log('endpoint', endpoint)
    const response = await window.fetch(endpoint, options)
    const text = await response.text()
    if (response.ok) {
      try {
        return JSON.parse(text)
      } catch (e) {
        return text
      }
    } else {
      let m = text || ''
      try {
        m = JSON.parse(text).message
      } catch (e) {
        const regex = /text\/html/i
        if (response.headers.get('content-type').match(regex)) {
          // text/html - don't return that whole thing
          m = ''
        }
      }
      // console.log('bad response', m)
      let message = `${response.status} ${response.statusText}`
      if (m && m.length) {
        message += ` ${m}`
      }
      const error = Error(message)
      error.status = response.status
      error.statusText = response.statusText
      error.text = m
      error.json = JSON.parse(text)
      throw error
    }
  } catch (e) {
    // just rethrow any other errors, like connection timeouts
    throw e
  }
}
