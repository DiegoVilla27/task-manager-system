/**
 * Dispara la descarga automática de un objeto Blob en el navegador.
 *
 * @param blob - Objeto de datos binarios retornado por el backend.
 * @param defaultFilename - Nombre del archivo con extensión (ej. 'Reporte_Libros.xlsx').
 */
export const triggerBlobDownload = (
  blob: Blob,
  defaultFilename: string,
): void => {
  // 1. Crear una URL en la memoria del navegador apuntando al Blob
  const blobUrl = window.URL.createObjectURL(blob);

  // 2. Crear un elemento <a> invisible
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = defaultFilename;

  // 3. Simular el clic para iniciar la descarga
  document.body.appendChild(link);
  link.click();

  // 4. Limpiar el DOM y liberar el objeto de la memoria RAM
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};
