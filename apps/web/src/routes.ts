export const AppRoutes = {
  tasks: () => buildRoute('/'),
  completed: () => buildRoute('/completed'),
  archived: () => buildRoute('/archived'),
}

function buildRoute(route: string) {
  return route
}
