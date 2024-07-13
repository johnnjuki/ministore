import {
  Facebook,
  Instagram,
  Package,
  Ship,
  ShoppingCart,
  TicketPercent,
  Twitter
} from "lucide-react";
import { Social } from "./types";

export const socials: Social[] = [
  {
    icon: <Facebook />,
    description: "Like & follow on Facebook",
    href: `/admin/loyalty/points/socials/facebook/like`,
  },
  {
    icon: <Twitter />,
    description: "Follow on X",
    href: `/admin/loyalty/points/socials/x/follow`,
  },
  {
    icon: <Instagram />,
    description: "Follow on Instagram",
    href: `/admin/loyalty/points/socials/instagram/follow`,
  },
];

export const rewards = [
  {
    id: 1,
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Discount",
    description: "100 points for $1 discount",
    points: 100,
  },
  {
    id: 2,
    icon: <TicketPercent className="h-8 w-8" />,
    title: "% off coupon",
    description: "500 points for 5% off",
    points: 500,
  },
  {
    id: 3,
    icon: <Ship className="h-8 w-8" />,
    title: "Free Shipping",
    description: "1000 points for free shipping on any product",
    points: 1000,
  },
  {
    id: 4,
    icon: <Package className="h-8 w-8" />,
    title: "Free Product",
    description: "1000 points for a free product below $10",
    points: 1000,
  },
];
