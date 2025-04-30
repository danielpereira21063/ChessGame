import { useSearchParams } from "react-router-dom";
import EasyBot from "../../bots/EasyBot";
import { PieceColor } from "../../util/chess/boardFactory";
import { ChessProvider } from "../../contexts/ChessContext";
import { BotGameLayout } from "./BotGameLayout";
import { useState } from "react";

export default function PlayWithBot() {
  const [search] = useSearchParams();
  const diff = (search.get('difficulty') || 'easy').toLowerCase();

  const BotImpl =
    // diff === 'hard'   ? HardBot   :
    // diff === 'medium' ? MediumBot :
                       EasyBot;   // default

  const [botColor] = useState(
    Math.random() < 0.5 ? PieceColor.WHITE : PieceColor.BLACK
  );
  const playerColor =
    botColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

  return (
    <ChessProvider>
      <BotGameLayout
        BotImpl={BotImpl}
        botColor={botColor}
        playerColor={playerColor}
      />
    </ChessProvider>
  );
}
