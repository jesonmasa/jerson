export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CLP`;
}
