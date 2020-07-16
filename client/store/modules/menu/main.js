import lazyLoading from './lazyLoading'

const path = '/pcce-12-5/main'

export default {
  name: 'Main',
  meta: {
    icon: 'folder',
    iconExpanded: 'folder-open',
    expanded: false
  },
  children: [
    {
      name: 'Home',
      path: path + '/home',
      meta: {
        icon: 'home',
        description: 'home'
      },
      component: lazyLoading('main/home')
    }
    // {
    //   name: 'Finesse',
    //   path: path + '/finesse',
    //   meta: {
    //     icon: 'view-quilt',
    //     label: 'Finesse',
    //     description: 'Edit Finesse gadget layout'
    //   },
    //   component: lazyLoading('main/finesse')
    // }
  ]
}
