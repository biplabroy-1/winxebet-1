import Image from "next/image";
import Link from "next/link";
import React from "react";

import hotGame from "@/../public/icons/nav-hotgames.svg";
import slot from "@/../public/icons/nav-slot.svg";
import sport from "@/../public/icons/nav-sport.svg";
import live from "@/../public/icons/nav-live.svg";
import lottery from "@/../public/icons/nav-lottery.svg";
import fav from "@/../public/icons/nav-fav.svg";
import pvp from "@/../public/icons/nav-pvp.svg";
import gift from "@/../public/icons/nav-gift.svg";
import reward from "@/../public/icons/nav-reward.svg";
import fish from "@/../public/icons/nav-fish.svg";
import poker from "@/../public/icons/poker.svg"; // placeholder icon
const menuData = [
  {
    title: "Games",
    icon: require("@/../public/icons/subrat1.svg"),
    redirect: "/games",
  },
  {
    title: "Slots",
    icon: slot,
    redirect: "/slots",
  },
  {
    title: "Sports",
    icon: sport,
    redirect: "/sports",
  },
  {
    title: "Live",
    icon: live,
    redirect: "/live-casino",
  },

  {
    title: "Favorites",
    icon: fav,
    redirect: "/favorites",
  },

  {
    title: "Lottery",
    icon: lottery,
    redirect: "/lottery",
  },

  {
    title: "PVP",
    icon: pvp,
    redirect: "/pvp",
  },
  {
    title: "Promotion",
    icon: require("@/../public/icons/subrat.svg"),
    redirect: "/promotion",
  },
  {
    title: "Reward",
    icon: reward,
    redirect: "/rewardCenter",
  },
  {
    title: "Fish",
    icon: fish,
    redirect: "/fish",
  },
  {
    title: "friends",
    icon: require("@/../public/icons/subrat2.svg"),
    redirect: "/invite-friends",
  },
  {
    title: "Manual",
    icon: require("@/../public/icons/subrat3.svg"),
    redirect: "/manual",
  },
  {
    title: "VIP",
    icon: require("@/../public/icons/subrat4.svg"), // placeholder
    redirect: "/vip",
  },
  {
    title: "Mission",
    icon: require("@/../public/icons/mission.svg"),  // placeholder
    redirect: "/mission",
  },
  {
    title: "Languages",
    icon: gift, // placeholder
    redirect: "/languages",
  },
  {
    title: "E-sports",
    icon: require("@/../public/icons/nav-esport.svg"),
    redirect: "/e-sports",
  },
  {
    title: "APP",
    icon: require("@/../public/icons/subrat5.svg"), // placeholder
    redirect: "/appp",
  },
  {
    title: "Chat",
    icon: require("@/../public/icons/subrat6.svg"),
    redirect: "/chat",
  },
  {
    title: "Poker",
    icon: poker,
    redirect: "#",
  },
 
];

const SideNav = () => {
  return (
    <div className="h-screen !bg-[black] overflow-y-auto scrollbar-thin scrollbar-thumb-[#006165] scrollbar-track-[#044243]">
      <div className="grid grid-cols-2 items-start gap-2 px-5 py-8  h-auto">
        {menuData.map((menu, i) => (
          <Link
            key={i}
            href={menu.redirect}
            className="flex overflow-hidden relative flex-col justify-center items-center px-3 py-2.5 w-full text-base font-bold text-center text-emerald-50 rounded-xl border-emerald-50 bg-[#003840] decoration-emerald-50 h-[93px] outline-emerald-50 shadow-[rgb(0,31,35)_0px_1.328px_0px_0px,rgb(0,97,101)_0px_1.328px_0px_0px_inset]"
            aria-label={menu.title}
          >
            <figure className="overflow-hidden mb-1.5 w-10 h-10 text-base font-bold text-center text-emerald-50 bg-cover border-emerald-50 decoration-emerald-50 fill-[url('#icon_gradient2')] outline-emerald-50">
              <Image src={menu.icon} alt={menu.title} className="w-[40px]" />
            </figure>
            <span className="text-base font-bold text-center text-emerald-50 border-emerald-50 decoration-emerald-50 outline-emerald-50">
              {menu.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
