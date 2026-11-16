<template>
  <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
    <aside class="card self-start space-y-1">
      <RouterLink to="/admin/songs" class="block px-3 py-2 rounded hover:bg-slate-100">Песни</RouterLink>
      <RouterLink to="/admin/artists" class="block px-3 py-2 rounded hover:bg-slate-100">Исполнители</RouterLink>
      <RouterLink to="/admin/countries" class="block px-3 py-2 rounded hover:bg-slate-100">Страны</RouterLink>
      <RouterLink to="/admin/genres" class="block px-3 py-2 rounded hover:bg-slate-100">Жанры</RouterLink>
      <RouterLink to="/admin/users" class="block px-3 py-2 rounded hover:bg-slate-100">Пользователи</RouterLink>
      <RouterLink to="/admin/reviews" class="block px-3 py-2 rounded hover:bg-slate-100">Модерация</RouterLink>
    </aside>
    <section>
      <RouterView />
    </section>
  </div>
</template>