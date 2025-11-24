import {
  ShoppingCart,
  Gift,
  ArrowLeftRight,
  UserPlus,
  Home as HomeIcon,
  Wallet as WalletIcon,
  Compass,
  History,
  Mail,
  Tag,
  Users,
} from "lucide-react";

const REGULAR_ITEMS = [
  { label: "Home", icon: HomeIcon, path: "/dashboard" },
  { label: "Wallet", icon: WalletIcon, path: "/wallet" },
  { label: "Past Transactions", icon: History, path: "/past-transactions" },
  { label: "Explore", icon: Compass, path: "/explore", children: [ { label: "Events", path: "/explore/events" }, { label: "Promotions", path: "/explore/promotions" }] },
  { label: "Event Invitations", icon: Mail, path: "/events/invitations" },
];

const CASHIER_EXTRA = [
  { label: "Create Transaction", icon: ShoppingCart, path: "/create" },
  { label: "Process Redemption", icon: Gift, path: "/redeem" },
  { label: "Create User", icon: UserPlus, path: "/createUser" },
];

const MANAGER_EXTRA = [
  { label: "Promotions", icon: Tag, path: "/promotions" },
];

const SUPERUSER_EXTRA = [
  { label: "Manage Users", icon: Users, path: "/manageUsers" },
];

export function getNavForRole(role) {
  const items = [...REGULAR_ITEMS];

  if (role === "cashier" || role === "manager" || role === "superuser") {
    items.push(...CASHIER_EXTRA);
  }

  if (role === "manager" || role === "superuser") {
    items.push(...MANAGER_EXTRA);
  }

  if (role === "superuser") {
    items.push(...SUPERUSER_EXTRA);
  }

  return items;
}
