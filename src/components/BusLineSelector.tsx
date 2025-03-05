import styled from 'styled-components';
import type BusLine from '../types/busLine';

const GreenButton = styled.button`
    background-color: green;
    border-radius: 50%;
    width: 100px; /* Fixed size */
    height: 100px; /* Fixed size */
    color: white;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: darkgreen;
    }
    font-size: 28px;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    justify-items: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding: 16px;
    box-sizing: border-box;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

interface Props {
	busLines: BusLine[];
	onSelectLine: (busLineId: string) => void;
}

const BusLineSelector = ({ busLines, onSelectLine }: Props) => {
	return (
		<GridContainer>
			{busLines.map((busLine) => (
				<ButtonWrapper key={busLine.id}>
					<GreenButton onClick={() => onSelectLine(busLine.id)}>
						{busLine.name}
					</GreenButton>
				</ButtonWrapper>
			))}
		</GridContainer>
	);
};

export default BusLineSelector;
