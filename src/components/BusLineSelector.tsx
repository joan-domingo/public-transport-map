import styled from 'styled-components';
import appStore from '../store/appStore';

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

interface BusLine {
	id: string;
	name: string;
}

const busLines: BusLine[] = [
	// { id: 'e1', name: 'e1' },
	// { id: 'e2.1', name: 'e2.1' },
	// { id: 'e2.2', name: 'e2.2' },
	{ id: 'e3', name: 'e3' },
	// { id: 'e11.1', name: 'e11.1' },
	// { id: 'e11.2', name: 'e11.2' },
];

const BusLineSelector = () => {
	const setBusLine = appStore((state) => state.setBusLineId);
	const handleButtonClick = (busLineId: string) => {
		setBusLine(busLineId);
	};

	return (
		<GridContainer>
			{busLines.map((busLine) => (
				<ButtonWrapper key={busLine.id}>
					<GreenButton onClick={() => handleButtonClick(busLine.id)}>
						{busLine.name}
					</GreenButton>
				</ButtonWrapper>
			))}
		</GridContainer>
	);
};

export default BusLineSelector;
