import { redirect } from "next/navigation";

export default function NewPaymentMethodLegacyPage() {
  redirect("/profile/payments/methods?action=add");
}
