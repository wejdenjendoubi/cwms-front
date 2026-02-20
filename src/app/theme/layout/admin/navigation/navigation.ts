export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Mon Projet',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard-perso',
        title: 'Mon Dashboard CWMS',
        type: 'item',
        url: '/dashboard-v1',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'auth',
    title: 'Authentification',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signin',
        title: 'Connexion',
        type: 'item',
        url: '/login',
        icon: 'feather icon-log-in',
        target: true
      },
      {
        id: 'signup',
        title: 'Inscription',
        type: 'item',
        url: '/register',
        icon: 'feather icon-at-sign',
        target: true
      }
    ]
  }
];
