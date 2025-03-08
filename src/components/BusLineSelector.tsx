import styled from 'styled-components';
import type BusLine from '../types/busLine';

const GreenButton = styled.button`
    width: 100px;              /* Amplada del cercle */
    height: 100px;             /* Alçada del cercle */
    border-radius: 50%;       /* Fa que el div sigui un cercle */
    background-color: #088b9f; /* Color de fons del cercle (podeu canviar-lo) */
    display: flex;
    justify-content: center;  /* Centra les inicials horitzontalment */
    align-items: center;      /* Centra les inicials verticalment */
    color: white;             /* Color del text (les inicials) */
    font-weight: bold;        /* Font en negreta */
    font-size: 40px;          /* Mida de la font per les inicials */
    &:hover {
        background-color: white;
        color: #088b9f;
        border: solid 4px #088b9f;
    }
`;

const Header = styled.header`
    display: flex;
    height: 96px;
    background-color: #088b9f;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h2`
    color: white;
`;

const Description = styled.div`
    display: flex;
    height: 48px;
    color: white;
    background-color: #088b9f;
    border-top: 1px solid white;
    justify-content: center;
    align-items: center;
`;

const Footer = styled.div`
    display: flex;
    height: 48px;
    justify-content: center;
    align-items: center;
`;

const MainContent = styled.main`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const GridContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
`;

interface Props {
	busLines: BusLine[];
	onSelectLine: (busLineId: string) => void;
}

const BusLineSelector = ({ busLines, onSelectLine }: Props) => {
	return (
		<GridContainer>
			<Header>
				<img
					src="/busIcon.svg"
					alt="Icona QuanTriga.com"
					style={{
						width: '48px',
						height: '48px',
						padding: '24px',
					}}
				/>
				<Title>QuanTriga.com</Title>
			</Header>
			<Description>
				Consulta en temps real l'arribada dels propers busos
			</Description>
			<MainContent>
				{busLines.map((busLine) => (
					<ButtonWrapper key={busLine.id}>
						<GreenButton onClick={() => onSelectLine(busLine.id)}>
							{busLine.name}
						</GreenButton>
					</ButtonWrapper>
				))}
			</MainContent>
			<Footer>
				Dades proporcionades per
				<a
					href="https://www.moventis.es/ca/temps-real"
					target="_blank"
					rel="noreferrer"
					style={{ marginLeft: '4px' }}
				>
					Moventis
				</a>
			</Footer>
		</GridContainer>
	);
};

export default BusLineSelector;
