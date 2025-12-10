export function getPriceBackgroundColor(price: number) {
    if (price > 100) {
        return '#D0312D';
    }
    if (price > 50) {
        return '#E69B00';
    }
    if (price > 20) {
        return '#6D79E8';
    }
    if (price > 1) {
        return '#A7AEF1';
    }
}
