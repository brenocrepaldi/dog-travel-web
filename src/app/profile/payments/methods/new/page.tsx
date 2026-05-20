import { redirect } from "next/navigation";

export default function PaymentMethodsNewMovedPage() {
  redirect("/profile/payment-methods?action=add");
}
