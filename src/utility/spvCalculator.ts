export function calculateSPV(
    ppCash: number, 
    referralTickets: number, 
    totalPurchases: number, 
    totalReferred: number
): number {
    return (ppCash * 0.2) + (referralTickets * 0.1) + (totalPurchases * 0.05) + (totalReferred * 0.08);
}
