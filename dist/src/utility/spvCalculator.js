"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSPV = calculateSPV;
function calculateSPV(ppCash, referralTickets, totalPurchases, totalReferred) {
    return (ppCash * 0.2) + (referralTickets * 0.1) + (totalPurchases * 0.05) + (totalReferred * 0.08);
}
