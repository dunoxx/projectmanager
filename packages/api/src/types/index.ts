export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  hasOutlineIntegration: boolean;
  members: OrganizationMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
}

export interface PlaneProject {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  outlineCollectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutlineCollection {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  planeProjectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationConfig {
  id: string;
  organizationId: string;
  planeApiKey?: string;
  outlineApiKey?: string;
  syncEnabled: boolean;
  syncInterval: number;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
} 