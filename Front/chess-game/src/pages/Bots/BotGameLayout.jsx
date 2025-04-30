import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useChess } from '../../contexts/ChessContext';
import { PieceColor } from '../../util/chess/boardFactory';
import ChessBoard from '../../components/chess/board/ChessBoard';
import GameInfoCard from '../../components/chess/info/GameInfoCard';

export function BotGameLayout({ BotImpl, botColor, playerColor }) {
    const { state, dispatch } = useChess();

    useEffect(() => {
        if (state.turn === botColor) {
            const id = setTimeout(() => BotImpl(state, dispatch), 250);
            return () => clearTimeout(id);
        }
    }, [state, botColor, dispatch, BotImpl]);

    return (
        <Row className="justify-content-between">
            <Col md={8}>
                <ChessBoard
                    orientation={playerColor === PieceColor.WHITE ? 'white' : 'black'}
                    playerColor={playerColor}
                />
            </Col>

            <Col xs={12} md={4} className="mt-3 mt-md-0">
                <GameInfoCard />
            </Col>
        </Row>
    );
}