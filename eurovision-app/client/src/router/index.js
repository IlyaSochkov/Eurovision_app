import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/library', name: 'library', component: () => import('../views/LibraryView.vue') },
  { path: '/songs/:id', name: 'song', component: () => import('../views/SongDetailView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: () => import('../views/PlaylistsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/playlists/:id',
    name: 'playlist',
    component: () => import('../views/PlaylistDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: { name: 'admin-songs' } },
      { path: 'songs', name: 'admin-songs', component: () => import('../views/admin/AdminSongsView.vue') },
      { path: 'songs/new', name: 'admin-song-new', component: () => import('../views/admin/AdminSongFormView.vue') },
      { path: 'songs/:id/edit', name: 'admin-song-edit', component: () => import('../views/admin/AdminSongFormView.vue') },
      { path: 'artists', name: 'admin-artists', component: () => import('../views/admin/AdminArtistsView.vue') },
      { path: 'countries', name: 'admin-countries', component: () => import('../views/admin/AdminCountriesView.vue') },
      { path: 'genres', name: 'admin-genres', component: () => import('../views/admin/AdminGenresView.vue') },
      { path: 'users', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue') },
      { path: 'reviews', name: 'admin-reviews', component: () => import('../views/admin/AdminReviewsView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  // Если не авторизован и идёт не на login/register — на login
  if (!auth.isAuthenticated && !['login', 'register'].includes(to.name)) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  // Если авторизован и пытается открыть login/register — на главную
  if (auth.isAuthenticated && ['login', 'register'].includes(to.name)) {
    return { name: 'home' };
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' };
  }
});

export default router;