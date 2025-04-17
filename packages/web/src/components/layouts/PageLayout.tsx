import React, { ReactNode } from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Layout padrão para páginas da aplicação
 * Inclui cabeçalho, navegação lateral e breadcrumbs
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
  breadcrumbs = [],
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (barra lateral) */}
      <div className="w-64 bg-white shadow-sm fixed h-full">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Project Manager</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <span className="ml-2">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/organizations" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <span className="ml-2">Organizações</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <span className="ml-2">Configurações</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex text-sm text-gray-500">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-primary">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Título da página */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-gray-600">{description}</p>
          )}
        </div>

        {/* Conteúdo da página */}
        {children}
      </main>
    </div>
  );
};

export default PageLayout; 