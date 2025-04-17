import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Constantes e configurações
const JWT_SECRET = process.env.JWT_SECRET || 'desenvolvimento-secreto-temporario';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const OUTLINE_SECRET = process.env.OUTLINE_SECRET || 'outline-segredo-desenvolvimento';

// Interface para usuário
interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: string;
}

/**
 * Serviço de autenticação que gerencia tokens JWT e autenticação
 * unificada entre Plane e Outline
 */
class AuthService {
  /**
   * Gera um token JWT para um usuário
   * @param user Dados do usuário
   * @returns Token JWT assinado
   */
  generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
      role: user.role
    };

    // Ignora o erro de tipo usando any
    return jwt.sign(
      payload, 
      JWT_SECRET as any, 
      { expiresIn: JWT_EXPIRES_IN as any }
    );
  }

  /**
   * Valida um token JWT
   * @param token Token JWT a ser validado
   * @returns Dados do payload se válido, null se inválido
   */
  validateToken(token: string): any | null {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return null;
    }
  }

  /**
   * Gera um token JWT específico para autenticação com o Outline
   * @param user Dados do usuário
   * @param organizationSlug Slug da organização
   * @param collectionId ID da collection (opcional, relacionado ao projeto)
   * @returns URL de autenticação para o Outline
   */
  generateOutlineAuthUrl(
    user: User, 
    organizationSlug: string, 
    collectionId?: string
  ): string {
    // Payload específico para o Outline
    const outlinePayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      organizationId: organizationSlug,
      ...(collectionId && { collectionId }),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hora
    };

    // Gerar token JWT com o segredo do Outline
    const token = jwt.sign(outlinePayload, OUTLINE_SECRET);
    
    // URL base do Outline (deve ser definida nas variáveis de ambiente em produção)
    const outlineUrl = process.env.OUTLINE_URL || 'https://app.outline.com';
    
    // Retornar a URL completa para autenticação
    return `${outlineUrl}/auth/jwt?token=${token}`;
  }

  /**
   * Hash de senha para armazenamento seguro
   * @param password Senha a ser hasheada
   * @returns Hash da senha
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compara senha fornecida com hash armazenado
   * @param password Senha fornecida
   * @param hashedPassword Hash armazenado
   * @returns Verdadeiro se a senha corresponder ao hash
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Gera um token de refresh para renovação de sessão
   * @returns Token único
   */
  generateRefreshToken(): string {
    return uuidv4();
  }
}

export default new AuthService(); 