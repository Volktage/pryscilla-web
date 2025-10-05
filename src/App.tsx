import './App.css';
import FlowfieldAnimation from './components/FlowfieldAnimation';
import prysPhoto from '/prys.png';

function App() {
  return (
    <>
      <div className="animation-background">
        <FlowfieldAnimation />
      </div>

      <div className="container content-foreground">
        <header className="hero">
          <img src={prysPhoto} alt="Foto de Pryscilla Miranda" className="profile-photo" />
          
          <h1>Pryscilla Faria Miranda</h1>
          <p className="crp">CRP 01/29774</p>
          
          <p>
            Psicóloga com foco no atendimento de adolescentes (a partir de 14 anos), adultos e idosos.
          </p>
          
          <a href="https://wa.me/61981033484" target="_blank" rel="noopener noreferrer" className="cta-button">
            Agende uma Conversa
          </a>
        </header>

        <main>
          <section className="section">
            <h2>Minha Abordagem</h2>
            <p>
              Trabalho com base na Psicologia Clínica e na TCC e Psicanálise,
              buscando compreender a singularidade de cada pessoa e ajudá-la a
              lidar com ansiedade, autoestima, relacionamentos, transições de
              vida e outras demandas emocionais.
            </p>
          </section>

          <section className="section">
            <h2>Um Espaço de Acolhimento</h2>
            <p>
              Meu objetivo é proporcionar um espaço seguro, ético e acolhedor,
              promovendo autoconhecimento e bem-estar psicológico.
            </p>
          </section>
        </main>

        <footer className="footer">
          <p>Pryscilla Faria Miranda - CRP 01/29774</p>
          <p>Contato: seu.email@dominio.com</p>
        </footer>
      </div>
    </>
  );
}

export default App;