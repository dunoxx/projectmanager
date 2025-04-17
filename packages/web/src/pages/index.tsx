import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className="container">
      <Head>
        <title>Project Manager | Gerenciamento de Projetos e Documentação</title>
        <meta name="description" content="Sistema integrado de gerenciamento de projetos e documentação" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Project Manager
        </h1>

        <p className="description">
          Gerenciamento de projetos e documentação em uma única plataforma
        </p>

        <div className="grid">
          <Link href="/projects" className="card">
            <h2>Projetos &rarr;</h2>
            <p>Gerencie seus projetos, tarefas e equipes.</p>
          </Link>

          <Link href="/docs" className="card">
            <h2>Documentação &rarr;</h2>
            <p>Acesse toda a documentação de seus projetos.</p>
          </Link>

          <Link href="/dashboard" className="card">
            <h2>Dashboard &rarr;</h2>
            <p>Visualize métricas e acompanhe o progresso.</p>
          </Link>

          <Link href="/settings" className="card">
            <h2>Configurações &rarr;</h2>
            <p>Personalize a plataforma conforme suas necessidades.</p>
          </Link>
        </div>
      </main>

      <footer>
        <p>
          Desenvolvido pela Sua Empresa &copy; {new Date().getFullYear()}
        </p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
          color: #333;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer p {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          color: #4f46e5;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 1rem 0 3rem;
        }

        .grid {
          display: flex;
          align-items: stretch;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          gap: 1.5rem;
        }

        .card {
          flex-basis: calc(50% - 1.5rem);
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease, transform 0.2s ease;
          background-color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #4f46e5;
          border-color: #4f46e5;
          transform: translateY(-5px);
        }

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
          
          .card {
            flex-basis: 100%;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home; 