import {ToastProgrammatic as Toast} from 'buefy'

function openNotification (options) {
  Toast.open({
    duration: options.duration || 5000,
    message: options.message,
    type: 'is-' + options.type
  })
}

const actions = {
  notification ({state}, options) {
    openNotification({
      title: options.title || '',
      message: options.message || '',
      type: options.type || 'info',
      duration: options.duration || 6000
    })
  },
  successNotification ({state}, options) {
    if (typeof options === 'string') {
      return openNotification({
        title: options,
        message: '',
        type: 'success',
        duration: 2500
      })
    } else {
      return openNotification({
        title: options.title,
        message: options.message,
        type: 'success',
        duration: options.duration || 2500
      })
    }
  },
  errorNotification ({state}, options) {
    if (typeof options === 'string') {
      return openNotification({
        title: options,
        message: '',
        type: 'danger',
        duration: 8000
      })
    } else if (typeof options.error === 'object') {
      // exception
      openNotification({
        title: options.title,
        message: options.error.message,
        type: 'danger',
        duration: options.duration || 8000
      })
    } else {
      // config
      openNotification({
        title: options.title,
        message: options.message,
        type: 'danger',
        duration: options.duration || 8000
      })
    }
  },
  infoNotification ({state}, options) {
    openNotification({
      title: options.title,
      message: options.message,
      type: 'info',
      duration: options.duration || 6000
    })
  },
  warningNotification ({state}, options) {
    openNotification({
      title: options.title,
      message: options.message,
      type: 'warning',
      duration: options.duration || 6000
    })
  }
}

export default {
  actions
}
