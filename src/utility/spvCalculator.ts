export function calculateSPV(ppCash: number, referralTickets: number, totalPurchases: number, totalReferred: number): number {
    const spv = (ppCash * 0.2) + (referralTickets * 0.1) + (totalPurchases * 0.05) + (totalReferred * 0.08);
    
    return Math.min(200, Math.max(0, spv));
}
