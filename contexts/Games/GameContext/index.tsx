"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Game, GameContextProviderProps, StartGame } from "./types";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
interface GameContextType {
  isLoading: boolean;
  game: Game | null;
  fetchGame(slug: string): Promise<void>;
  iframeGame: string | null;
}

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const { push } = useRouter();
  const { isLogged } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [game, setGame] = useState<Game | null>(null);
  const [iframeGame, setIframeGame] = useState<string | null>(null);

  const fetchGame = async (slug: string) => {
    setIsLoading(true);

    await api
      .get<Game>(`/games/game-provider/${slug}`)
      .then((response) => {
        setGame(response.data);
      })
      .catch((error) => {
        push("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const startGame = async (slug: string) => {
    setIsLoading(true);

    const response = await api
      .get<any>(`/games/game-provider/start-game/${slug}`)
      .finally(() => {
        setIsLoading(false);
      });

    setIframeGame(response.data);
  };

  useEffect(() => {
    if (game?.slug && isLogged) {
      startGame(game.slug);
    }
  }, [game, isLogged]);

  return (
    <GameContext.Provider
      value={{
        isLoading,
        game,
        fetchGame,
        iframeGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame está fora de ThemeProvider.");
  }
  return context;
};
