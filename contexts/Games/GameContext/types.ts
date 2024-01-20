import { ReactNode } from "react";

export interface GameContextProviderProps {
  children: ReactNode
}

export type StartGame = {
  data: {
    operator_player_session: string,
    game_url: string,
  }
}

export type Game = {
  id: number,
  game_id: string | number,
  games_providers_id: number,
  name: string,
  slug: string,
  image?: string,
  games_provider: {
    id: number,
    name: string,
    slug: string,
    image?: string,
  }
}
