"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSPV = calculateSPV;
function calculateSPV(ppCash, referralTickets, totalPurchases, totalReferred) {
    const spv = (ppCash * 0.2) + (referralTickets * 0.1) + (totalPurchases * 0.05) + (totalReferred * 0.08);
    return Math.min(200, Math.max(0, spv));
}
