"use client";
import { useWallet } from "@/contexts/WalletContext";
import { formatBRL } from "@/utils/currency";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function BalanceProfile() {
  const { wallet, isLoading, fetchBalance } = useWallet();

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <Menu.Button
        onClick={fetchBalance}
        className="cursor-pointer relative bg-[#07050a] border border-white/10 rounded flex items-center gap-2 p-2 h-11 text-center font-medium text-xs md:text-sm "
      >
        {/*   <Image
          src={`/${process.env.NEXT_PUBLIC_SITE_NAME}/coin.png`}
          width={19}
          height={19}
          alt=""
          className={` ${isLoading ? "animate-bounce" : ""}`}
        /> */}
        <div className="flex flex-col justify-center items-end">
          <span className="text-white font-semibold text-sm h-4 leading-4">
            {formatBRL((wallet?.balance ?? 0.0) + (wallet?.bonus ?? 0.0))}
          </span>
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="divide-y text-white divide-zinc-800 absolute overflow-hidden flex flex-col bg-[#07050a] border border-white/10 right-0 top-12 w-44 rounded-lg ">
          <div className="text-sm flex justify-between hover:bg-zinc-800 p-2">
            <span className="font-light">Real:</span>
            <span>{formatBRL(wallet?.balance ?? 0.0)}</span>
          </div>
          {wallet && wallet?.bonus > 0 && (
            <div className="text-sm flex justify-between hover:bg-zinc-800 p-2">
              <span className="font-light">Bônus:</span>
              <span>{formatBRL(wallet?.bonus ?? 0.0)}</span>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
