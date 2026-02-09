import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_url', type: 'text', nullable: false })
  originalUrl: string;

  @Index()
  @Column({ name: 'short_code', length: 30, unique: true, nullable: false })
  shortCode: string;

  // Contador de cliques (começa em 0)
  @Column({ default: 0 })
  clicks: number;

  // Relacionamento: Muitas URLs pertencem a UM usuário
  // nullable: true porque usuários não logados também podem encurtar
  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  @JoinColumn({ name: 'user_id' }) // Cria a coluna user_id na tabela
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
