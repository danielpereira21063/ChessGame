import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { ChessProvider, useChess } from '../contexts/ChessContext';
import randomBot from '../bots/EasyBot';
import { PieceColor } from '../util/chess/boardFactory';
import ChessBoard from '../components/chess/board/ChessBoard';
import GameInfoCard from './../components/chess/info/GameInfoCard';

function GameLayout({ botColor, playerColor }) {
    const { state, dispatch } = useChess();

    useEffect(() => {
        if (state.turn === botColor) {
            const id = setTimeout(() => randomBot(state, dispatch), 300);
            return () => clearTimeout(id);
        }
    }, [state, botColor, dispatch]);

    return (
        <Row className="justify-content-between">
            <Col md={8}>
                <ChessBoard orientation={playerColor === PieceColor.WHITE ? 'white' : 'black'} playerColor={playerColor} />
            </Col>
            <Col xs={12} md={4} className="mt-3 mt-md-0">
                <GameInfoCard />
            </Col>
        </Row>
    );
}

export default function GamePage() {
    const [botColor] = useState(
        Math.random() < 0.5 ? PieceColor.WHITE : PieceColor.BLACK
    );
    const playerColor =
        botColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

    return (
        <ChessProvider>
            <GameLayout botColor={botColor} playerColor={playerColor} />
        </ChessProvider>
    );
}