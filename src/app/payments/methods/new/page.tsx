import { redirect } from "next/navigation";

export default function NewPaymentMethodAliasPage() {
  redirect("/payments/methods?action=add");
}
