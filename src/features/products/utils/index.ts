/**
 * Utilitaires spécifiques aux produits
 * Exemple: calcul de marge, formatage de prix, validation de stock
 */

export const calculateMargin = (cost: number, price: number) => {
    return ((price - cost) / price) * 100;
}
