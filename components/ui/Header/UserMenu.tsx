"use client";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  KeyIcon,
  UserIcon,
  UserPlusIcon,
  WalletIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function UserMenu() {
  const { signOut, user } = useAuth();
  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <div>
        <Menu.Button className="cursor-pointer rounded flex items-center p-3 border-zinc-500  text-center text-sm  bg-[#07050a] border border-white/10">
          <UserIcon width={18} height={18} className="text-[#8845fa]" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-[#07050a] border border-white/10 shadow-[#191919] shadow-lg focus:outline-none">
          <div className="p-4 flex flex-col gap-2 text-zinc-300 text-sm">
            <Menu.Item>
              <Link
                href="/user/account"
                className="rounded bg-[#111] px-4 h-10 items-center flex gap-2 hover:bg-zinc-800"
              >
                <UserIcon width={20} height={20} />
                Minha Conta
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                href="/user/wallet"
                className="rounded bg-[#111] px-4 h-10 items-center flex gap-2 hover:bg-zinc-800"
              >
                <WalletIcon width={20} height={20} />
                Carteira
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                href="/affiliate"
                className="rounded bg-[#111] px-4 h-10 items-center flex gap-2 hover:bg-zinc-800"
              >
                <UserPlusIcon width={20} height={20} />
                Afiliados
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                href="/user/change-password"
                className="rounded bg-[#111] px-4 h-10 items-center flex gap-2 hover:bg-zinc-800"
              >
                <KeyIcon width={20} height={20} />
                Alterar Senha
              </Link>
            </Menu.Item>
            <Menu.Item>
              <div className="cursor-pointer rounded bg-[#111] px-4 h-10 items-center flex gap-2 hover:bg-zinc-800">
                <Cog8ToothIcon width={20} height={20} />
                Suporte
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                className="cursor-pointer rounded bg-[#111] px-4 h-10 items-center flex gap-2 hover:bg-zinc-800"
                onClick={signOut}
              >
                <ArrowRightOnRectangleIcon width={20} height={20} />
                Sair
              </div>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
