import { IsIn, IsInt, IsUUID, Min } from "class-validator";

export const paymentMethods = ["CASH", "UPI", "CARD", "CHEQUE", "ONLINE"] as const;
export type PaymentMethodDto = typeof paymentMethods[number];

export class CollectPaymentDto {
  @IsUUID()
  demandId!: string;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsIn(paymentMethods)
  method!: PaymentMethodDto;
}
