/** Ruta de un archivo de public/ que funciona en local y en GitHub Pages. */
export function rutaPublica(ruta: string) {
  return `${import.meta.env.BASE_URL}${ruta.replace(/^\//, '')}`
}
