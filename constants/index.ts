export const totalSpaceInAppwrite = 2 * 1024

export const navItems = [
  {
    name: 'Dashboard',
    icon: '/assets/icons/dashboard.svg',
    url: '/'
  },
  {
    name: 'Documents',
    icon: '/assets/icons/documents.svg',
    url: '/documents',
    type: 'documents',
    bgColor: '#ff7474'
  },
  {
    name: 'Images',
    icon: '/assets/icons/images.svg',
    url: '/images',
    type: 'images',
    bgColor: '#5688ff'
  },
  {
    name: 'Media',
    icon: '/assets/icons/video.svg',
    url: '/media',
    type: 'media',
    bgColor: '#3dd9b3'
  },
  {
    name: 'Others',
    icon: '/assets/icons/others.svg',
    url: '/others',
    type: 'others',
    bgColor: '#eea8fd'
  }
]

export const avatarPlaceholderUrl =
  'https://img.freepik.com/psd-gratis/3d-ilustracion-persona-gafas-sol_23-2149436188.jpg'

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const actionsDropDownItems = [
  {
    label: 'Rename',
    icon: '/assets/icons/edit.svg',
    value: 'rename'
  },
  {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details'
  },
  {
    label: 'Share',
    icon: '/assets/icons/share.svg',
    value: 'share'
  },
  {
    label: 'Download',
    icon: '/assets/icons/download.svg',
    value: 'download'
  },
  {
    label: 'Delete',
    icon: '/assets/icons/delete.svg',
    value: 'delete'
  }
]

export const sortTypes = [
  {
    label: 'Date created (newest first)',
    value: '$createdAt-desc'
  },
  {
    label: 'Date created (oldest first)',
    value: '$createdAt-asc'
  },
  {
    label: 'Name (A-Z)',
    value: 'name-asc'
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc'
  },
  {
    label: 'Size (Highest)',
    value: 'size-desc'
  },
  {
    label: 'Size (Lowest)',
    value: 'size-asc'
  }
]
