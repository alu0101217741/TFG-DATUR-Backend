export const config = {
  OpenDataInterface: {
    baseUrl:
      process.env.OPEN_DATA_INTERACTOR_BASE_URL ||
      'https://datos.canarias.es/catalogos/general/api/action/package_show?id=',
  },
}
