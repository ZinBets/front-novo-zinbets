"use client";
import BadgeErrorsMessage from "@/components/ui/Errors/BadgeErrorsMessage";
import Input from "@/components/ui/Form/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useMines } from "@/contexts/Games/MinesContext";
import { useModal } from "@/contexts/ModalContext";
import { useWallet } from "@/contexts/WalletContext";
import { formatBRL } from "@/utils/currency";
import { Transition } from "@headlessui/react";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/20/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface IFormInputs {
  value_to_bet: string;
  number_of_bombs: number;
}

const schema = yup
  .object({
    value_to_bet: yup
      .string()
      .test("is-num", "Valor mínimo é R$0,01", (value) => {
        if (!value) return false;
        const amount = value.replace(/[^0-9]/g, "");
        if (parseInt(amount) < 1) {
          return false;
        }

        return true;
      })
      .required("Valor Obrigatório"),
    number_of_bombs: yup
      .number()
      .min(2, "O valor mínimo é 2")
      .max(24, "O valor máximo é 24")
      .required("Valor Obrigatório"),
  })
  .required();

export default function MinesPage() {
  const { isLogged } = useAuth();
  const [messageError, setMessageError] = useState({ type: "", message: "" });
  const { wallet } = useWallet();
  const { setOpenModal } = useModal();

  const {
    fetchGame,
    game,
    startGame,
    setClick,
    setCashout,
    volume,
    setVolume,
  } = useMines();
  const { fetchBalance } = useWallet();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      number_of_bombs: 5,
    },
  });

  function half_value_to_bet() {
    let value = getValues("value_to_bet").replace(/[^0-9]/g, "") as any;
    if (value == 0) {
      value = 2;
    }

    value = formatBRL(value / 100 / 2);
    setValue("value_to_bet", value);
  }

  function double_value_to_bet() {
    let value = getValues("value_to_bet").replace(/[^0-9]/g, "") as any;
    if (value == 0) {
      value = 1;
    }

    value = (value / 100) * 2;

    if (
      value >
      ((wallet?.balance ?? 0) > 0 ? wallet?.balance ?? 0 : wallet?.bonus ?? 100)
    ) {
      value =
        (wallet?.balance ?? 0) > 0
          ? wallet?.balance ?? 0
          : wallet?.bonus ?? 100;
    }

    value = formatBRL(value);
    setValue("value_to_bet", value);
  }

  function max_value_to_bet() {
    let value = formatBRL(
      (wallet?.balance ?? 0) > 0 ? wallet?.balance ?? 0 : wallet?.bonus ?? 100
    );
    setValue("value_to_bet", value);
  }

  const onSubmit = async ({ value_to_bet, number_of_bombs }: IFormInputs) => {
    if (!isLogged) {
      setOpenModal("login");
      return;
    }

    const response = await startGame({
      value_to_bet: Number(value_to_bet.replace(/[^0-9]/g, "")),
      number_of_bombs,
    });

    if (response?.type === "error") {
      setMessageError({ type: "error", message: response.message });
    } else {
      setMessageError({ type: "", message: "" });
    }
  };

  const handleClick = async (position: number) => {
    if (!!game?.finish || !isLogged) {
      return false;
    }

    await setClick(position);
  };

  const handleCashout = () => {
    if (!!game?.finish || !isLogged) {
      return;
    }

    setCashout();
    fetchBalance();
  };

  const isGameActive = game == null || !!game?.finish ? false : true;

  const isGema = (index: number) => {
    if (!game) return false;
    if (!!game?.bombs && game?.bombs.includes(index)) return false;

    return !!game?.clicks && game?.clicks.includes(index);
  };

  const isBomb = (index: number) => {
    return !!game?.bombs && game?.bombs.includes(index);
  };

  const handleToggleSound = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (isLogged) {
      fetchGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded border border-white/10 bg-[#0d0716] p-6 flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-t pt-4 lg:pt-0 lg:border-t-0 lg:border-r lg:pr-3 border-zinc-600 order-last lg:order-first col-span-3 lg:col-span-1"
        >
          <Input
            title="Valor da Aposta"
            type="tel"
            disabled={isGameActive}
            currency={true}
            {...register("value_to_bet", { required: true })}
            errors={errors.value_to_bet?.message}
          />

          <div className="flex -mt-2 mb-4 items-center justify-between rounded overflow-hidden">
            <button
              type="button"
              disabled={isGameActive}
              onClick={half_value_to_bet}
              className="disabled:cursor-not-allowed disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400 h-10 text-sm flex justify-center items-center cursor-pointer font-semibold bg-[#8845fa]/30 hover:text-white hover:bg-[#8845fa] flex-1 text-center text-zinc-400"
            >
              1/2
            </button>
            <button
              type="button"
              disabled={isGameActive}
              onClick={double_value_to_bet}
              className="disabled:cursor-not-allowed disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400 h-10 text-sm flex justify-center items-center cursor-pointer font-semibold bg-[#8845fa]/30 hover:text-white hover:bg-[#8845fa]  flex-1 text-center text-zinc-400"
            >
              2x
            </button>
            <button
              type="button"
              disabled={isGameActive}
              onClick={max_value_to_bet}
              className="disabled:cursor-not-allowed disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400 h-10 text-sm flex justify-center items-center cursor-pointer font-semibold bg-[#8845fa]/30 hover:text-white hover:bg-[#8845fa]  flex-1 text-center text-zinc-400"
            >
              MAX
            </button>
          </div>

          {!isGameActive ? (
            <>
              <div className="floating mb-3 relative">
                <select
                  {...register("number_of_bombs")}
                  className={`${
                    errors.number_of_bombs?.message &&
                    "border-red-500 border rounded-b-none"
                  } disabled:cursor-not-allowed bg-[#07050a] border border-white/10 text-base text-zinc-300 appearance-none block w-full px-4 h-14 leading-10 rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0`}
                >
                  {Array(23)
                    .fill(0)
                    .map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                </select>
                <label className="block mb-2 uppercase text-zinc-400 text-xs font-bold absolute top-0 left-0 px-4 py-[1.35rem] h-full pointer-events-none transform origin-left transition-all duration-100 ease-in-out ">
                  Número de Bombas
                </label>

                {errors?.number_of_bombs?.message && (
                  <div className="text-xs p-1 text-white text-center font-normal bg-red-500 w-full rounded-b-md">
                    {errors?.number_of_bombs?.message}
                  </div>
                )}
              </div>

              <div className="flex -mt-2 mb-4 items-center justify-between rounded overflow-hidden">
                <div
                  onClick={() => setValue("number_of_bombs", 3)}
                  className="h-10 flex text-sm justify-center items-center cursor-pointer font-semibold bg-[#8845fa]/30 hover:text-white hover:bg-[#8845fa]  flex-1 text-center text-zinc-400"
                >
                  3
                </div>
                <div
                  onClick={() => setValue("number_of_bombs", 5)}
                  className="h-10 flex text-sm justify-center items-center cursor-pointer font-semibold bg-[#8845fa]/30 hover:text-white hover:bg-[#8845fa]  flex-1 text-center text-zinc-400"
                >
                  5
                </div>
                <div
                  onClick={() => setValue("number_of_bombs", 15)}
                  className="h-10 flex text-sm justify-center items-center cursor-pointer font-semibold bg-[#8845fa]/30 hover:text-white hover:bg-[#8845fa]  flex-1 text-center text-zinc-400"
                >
                  15
                </div>
                <div
                  onClick={() => setValue("number_of_bombs", 24)}
                  className="h-10 flex text-sm justify-center items-center cursor-pointer font-semibold bg-[#8845fa]/30 hover:text-white hover:bg-[#8845fa]  flex-1 text-center text-zinc-400"
                >
                  24
                </div>
              </div>

              <BadgeErrorsMessage
                type={messageError.type}
                message={messageError.message}
              />

              <button
                type="submit"
                className="h-12 w-full text-center cursor-pointer  rounded shadow-green shadow-[#8845fa] bg-[#8845fa] text-white hover:bg-[#7139d3] px-2 py-2  font-bold text-xs md:text-sm"
              >
                Começar o jogo
              </button>
            </>
          ) : (
            <button
              disabled={game?.clicks.length === 0}
              onClick={handleCashout}
              type="button"
              className="disabled:cursor-not-allowed disabled:opacity-80 h-12 w-full text-center cursor-pointer  rounded shadow-green shadow-red-500 bg-red-500 text-white hover:bg-red-700 px-2 py-2  font-bold text-xs md:text-sm"
            >
              Retirar{" "}
              {formatBRL(
                ((game?.bet ?? 0) * (game?.payout_multiplier ?? 1)) / 100
              )}
            </button>
          )}

          <div className="w-full flex justify-end mt-4 gap-2">
            <div
              onClick={toggleFullScreen}
              className="rounded border border-zinc-600 p-1 hover:bg-zinc-800 cursor-pointer"
            >
              <ViewfinderCircleIcon className="w-6 h-6 text-zinc-400 mx-auto" />
            </div>

            <div
              onClick={handleToggleSound}
              className="rounded border border-zinc-600 p-1 hover:bg-zinc-800 cursor-pointer"
            >
              {volume > 0 ? (
                <SpeakerWaveIcon className="w-6 h-6 text-zinc-400 mx-auto" />
              ) : (
                <SpeakerXMarkIcon className="w-6 h-6 text-zinc-400 mx-auto" />
              )}
            </div>
          </div>
        </form>

        <div className="col-span-3 lg:col-span-2">
          <div className="grid grid-cols-5 gap-2 lg:gap-3 max-w-lg mx-auto relative">
            {Array(25)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i + 1}
                  onClick={() => handleClick(i + 1)}
                  className={`${
                    game?.clicks.includes(i + 1)
                      ? !!game?.bombs && game?.bombs.includes(i + 1)
                        ? "border-4 border-red-500 from-slate-400/5 to-slate-800/5 hover:from-white/20 hover:to-slate-600/20"
                        : "border-4 border-green-500 from-slate-400/5 to-slate-800/5 hover:from-white/20 hover:to-slate-600/20"
                      : !!game?.bombs && game?.bombs.includes(i + 1)
                      ? "border-b-4 border-red-900 from-red-500/80 to-red-600/80 hover:from-red-500/70 hover:to-red-600/70"
                      : "border-b-4 border-[#8845fa] from-[#3b1a74]/80 to-[#8845fa]/80 hover:from-[#3b1a74]/70 hover:to-[#8845fa]/70"
                  }
                  active:opacity-50 rounded-lg cursor-pointer overflow-hidden bg-gradient-to-t shadow  aspect-square`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="font-bold text-5xl text-white/40">
                      {(game?.bombs && game?.bombs.includes(i + 1)) ||
                      game?.clicks.includes(i + 1) ? (
                        <></>
                      ) : (
                        <>?</>
                      )}
                      <Transition
                        show={isGema(i + 1)}
                        enter="transform transition duration-[500ms]"
                        enterFrom="opacity-0 rotate-[360deg] scale-0"
                        enterTo="opacity-100 rotate-0 scale-100"
                        leave="transform duration-200 transition ease-in-out"
                        leaveFrom="opacity-100 rotate-0 scale-100 "
                        leaveTo="opacity-0 scale-95"
                      >
                        <Image
                          src={`/${process.env.NEXT_PUBLIC_SITE_NAME}/gema.png`}
                          width={56}
                          height={56}
                          className="w-[98%] h-[98%] m-auto"
                          alt="Gema"
                        />
                      </Transition>
                      <Transition
                        show={isBomb(i + 1)}
                        enter="transform transition duration-[500ms]"
                        enterFrom="opacity-0 rotate-[360deg] scale-0"
                        enterTo="opacity-100 rotate-0 scale-100"
                        leave="transform duration-200 transition ease-in-out"
                        leaveFrom="opacity-100 rotate-0 scale-100 "
                        leaveTo="opacity-0 scale-95"
                      >
                        <Image
                          src={`/${process.env.NEXT_PUBLIC_SITE_NAME}/bombs.png`}
                          width={56}
                          height={56}
                          className="w-[98%] h-[98%] m-auto"
                          alt="Bomb"
                        />
                      </Transition>
                    </div>
                  </div>
                </div>
              ))}

            {game && !!game.win && (
              <div className="absolute top-0  left-0 w-full h-full bg-zinc-700/40 flex items-center justify-center">
                <div className="w-60 h-32 text-center font-bold border border-white/10 bg-[#0d0716] shadow overflow-hidden rounded-lg flex items-center flex-col justify-center">
                  <div className="flex-1 flex items-center text-4xl drop-shadow">
                    X{game?.payout_multiplier}
                  </div>
                  <div className="w-full h-10 flex justify-center items-center text-sm bg-[#8845fa] p-2">
                    VOCÊ GANHOU{" "}
                    {formatBRL(
                      ((game?.bet ?? 1) * (game?.payout_multiplier ?? 1)) / 100
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
