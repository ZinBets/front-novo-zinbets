"use client";
import React, { createContext, useContext, useState } from "react";
import { ModalContextProviderProps } from "./types";

import Login from "@/components/ui/Modal/Auth/Login";
import Register from "@/components/ui/Modal/Auth/Register";
import Forgot from "@/components/ui/Modal/Auth/Forgot";
import Deposit from "@/components/ui/Modal/Deposit/Index";
import Withdraw from "@/components/ui/Modal/Withdraw/Index";
import { useAuth } from "../AuthContext";

type Children = "login" | "register" | "forgot" | "deposit" | "withdraw";

interface ModalContextType {
  isOpenModal: boolean;
  childrenModal: React.ReactNode | null;
  setOpenModal: (children: Children) => void;
  setCloseModal: () => void;
}

export const ModalContext = createContext<ModalContextType>(
  {} as ModalContextType
);

export const ModalContextProvider = ({
  children,
}: ModalContextProviderProps) => {
  const { isLogged } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<React.ReactNode | null>(
    null
  );

  const setClose = () => {
    setIsOpen(false);
  };

  const setOpen = (children: Children) => {
    if (!isLogged && (children === "deposit" || children === "withdraw")) {
      children = "register";
    }

    if (isLogged && (children === "login" || children === "register")) {
      children = "deposit";
    }

    const components = {
      login: <Login />,
      register: <Register />,
      forgot: <Forgot />,
      deposit: <Deposit />,
      withdraw: <Withdraw />,
    } as any;

    setChildrenModal(components[children]);
    setIsOpen(true);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpenModal: isOpen,
        childrenModal,
        setOpenModal: setOpen,
        setCloseModal: setClose,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal está fora de ThemeProvider.");
  }
  return context;
};
