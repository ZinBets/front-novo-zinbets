"use client"
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import Logo from "@/components/Logo"
import Input from "../../Form/Input"
import { useModal } from "@/contexts/ModalContext"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import BadgeErrorsMessage from "../../Errors/BadgeErrorsMessage"
import { Mail } from "lucide-react"

interface IFormInputs {
  email: string
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("O campo e-mail é obrigatório"),
  })
  .required()

export default function Forgot() {
  const { setOpenModal, setCloseModal } = useModal()
  const [messageError, setMessageError] = useState({ type: "", message: "" })
  const { forgotPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: IFormInputs) => {
    setMessageError({ message: "", type: "loading" })

    const response = await forgotPassword(data.email)

    setMessageError({ message: response.message, type: response.type })
  }

  return (
    <>
      <div className="justify-center flex items-center w-full mb-10">
        <Logo />
      </div>
      <div className="justify-flex-end block mb-4">
        <h1 className="text-white-700 text-xl">Redefinir senha</h1>
      </div>
      <BadgeErrorsMessage
        type={messageError.type}
        message={messageError.message}
      />

      <div className={`${messageError.type === "success" && "hidden"}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            title="E-mail"
            icon={<Mail size={16} />}
            placeholder="Digite seu e-mail"
            required
            {...register("email")}
            errors={errors.email?.message}
          />

          <button
            className="text-white-400 rounded-lg shadow-green bg-[#8845fa] hover:bg-[#713ad6] p-3 w-full"
            type="submit"
          >
            Enviar e-mail de recuperação
          </button>
        </form>

        <div className="w-full text-center text-xs text-zinc-400 mt-6">
          Ainda não tem uma conta?
          <b
            className="ml-2 text-green-500 cursor-pointer"
            onClick={() => setOpenModal("register")}
          >
            Criar uma conta grátis
          </b>
        </div>
      </div>
    </>
  )
}
