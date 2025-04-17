import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Script para popular o banco de dados com dados iniciais de teste
 */
async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional)
  console.log('Limpando dados existentes...');
  await prisma.task.deleteMany();
  await prisma.integrationConfig.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('Criando usuários...');
  const senha = await bcrypt.hash('senha123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: senha
    }
  });

  const devUser = await prisma.user.create({
    data: {
      email: 'dev@example.com',
      name: 'Desenvolvedor',
      password: senha
    }
  });

  // Criar organizações
  console.log('Criando organizações...');
  const acmeCorp = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      slug: 'acme'
    }
  });

  const techInc = await prisma.organization.create({
    data: {
      name: 'Tech Inc',
      slug: 'tech-inc'
    }
  });

  // Associar usuários às organizações
  console.log('Associando usuários às organizações...');
  await prisma.organizationMember.create({
    data: {
      userId: adminUser.id,
      organizationId: acmeCorp.id,
      role: 'admin'
    }
  });

  await prisma.organizationMember.create({
    data: {
      userId: devUser.id,
      organizationId: acmeCorp.id,
      role: 'member'
    }
  });

  await prisma.organizationMember.create({
    data: {
      userId: adminUser.id,
      organizationId: techInc.id,
      role: 'admin'
    }
  });

  // Criar projetos
  console.log('Criando projetos...');
  const webApp = await prisma.project.create({
    data: {
      name: 'Aplicação Web',
      slug: 'web-app',
      description: 'Uma aplicação web moderna com React e Node.js',
      organizationId: acmeCorp.id
    }
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: 'Aplicativo Móvel',
      slug: 'mobile-app',
      description: 'Aplicativo móvel para Android e iOS',
      organizationId: acmeCorp.id
    }
  });

  const api = await prisma.project.create({
    data: {
      name: 'API Interna',
      slug: 'internal-api',
      description: 'API REST para serviços internos',
      organizationId: techInc.id
    }
  });

  // Associar usuários aos projetos
  console.log('Associando usuários aos projetos...');
  await prisma.projectMember.create({
    data: {
      userId: adminUser.id,
      projectId: webApp.id,
      role: 'admin'
    }
  });

  await prisma.projectMember.create({
    data: {
      userId: devUser.id,
      projectId: webApp.id,
      role: 'member'
    }
  });

  await prisma.projectMember.create({
    data: {
      userId: adminUser.id,
      projectId: mobileApp.id,
      role: 'admin'
    }
  });

  await prisma.projectMember.create({
    data: {
      userId: devUser.id,
      projectId: mobileApp.id,
      role: 'member'
    }
  });

  await prisma.projectMember.create({
    data: {
      userId: adminUser.id,
      projectId: api.id,
      role: 'admin'
    }
  });

  // Criar tarefas
  console.log('Criando tarefas...');
  await prisma.task.createMany({
    data: [
      {
        title: 'Configurar ambiente de desenvolvimento',
        description: 'Configurar Docker, Node.js e React',
        status: 'done',
        priority: 'high',
        assigneeId: adminUser.id,
        projectId: webApp.id
      },
      {
        title: 'Implementar autenticação',
        description: 'Adicionar sistema de login com JWT',
        status: 'in_progress',
        priority: 'high',
        assigneeId: adminUser.id,
        projectId: webApp.id
      },
      {
        title: 'Criar páginas responsivas',
        description: 'Implementar interface adaptativa para desktop e mobile',
        status: 'todo',
        priority: 'medium',
        assigneeId: devUser.id,
        projectId: webApp.id
      },
      {
        title: 'Desenvolver tela inicial',
        description: 'Criar splash screen e onboarding',
        status: 'in_progress',
        priority: 'medium',
        assigneeId: adminUser.id,
        projectId: mobileApp.id
      },
      {
        title: 'Implementar notificações push',
        description: 'Integrar FCM e APNS para notificações',
        status: 'todo',
        priority: 'high',
        assigneeId: devUser.id,
        projectId: mobileApp.id
      },
      {
        title: 'Documentar endpoints',
        description: 'Criar documentação Swagger para API',
        status: 'todo',
        priority: 'medium',
        assigneeId: adminUser.id,
        projectId: api.id
      }
    ]
  });

  // Criar configuração de integração (simulando uma documentação já configurada)
  console.log('Criando configuração de integração para um projeto...');
  await prisma.integrationConfig.create({
    data: {
      planeProjectId: webApp.id,
      outlineCollectionId: 'col_' + Math.random().toString(36).substring(2, 9),
      organizationSlug: acmeCorp.slug,
      syncEnabled: true
    }
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 