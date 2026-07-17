import { authenticatedRequest } from "./auth-api";

export interface FeeDue {
  id: string; label: string; amount: number; dueDate: string; status: "due" | "paid"; studentName: string; classCode: string | null; className: string | null; rollNo: string | null;
}
export interface FinanceSummary { totalDue: number; dueCount: number; collected: number; dues: FeeDue[] }
export interface ParentFeesResponse { student: { id: string; name: string }; demands: Array<{ id: string; label: string; amount: number; dueDate: string; status: "DUE" | "PAID" }>; payments: Array<{ id: string; amount: number; receiptNo: string; createdAt: string }> }
export interface PaymentReceipt { id: string; amount: number; method: string; receiptNo: string; studentName: string }

export const getFinanceSummary = () => authenticatedRequest<FinanceSummary>("/finance/fees/summary");
export const getParentFees = () => authenticatedRequest<ParentFeesResponse>("/parent/fees");
export const collectOfflinePayment = (demandId: string, amount: number, method: string) => authenticatedRequest<PaymentReceipt>("/payments/offline", { method: "POST", body: JSON.stringify({ demandId, amount, method: method.toUpperCase() }) });
export const checkoutPayment = (demandId: string, amount: number) => authenticatedRequest<PaymentReceipt>("/payments/checkout", { method: "POST", body: JSON.stringify({ demandId, amount, method: "ONLINE" }) });
