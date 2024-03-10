import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Card } from 'src/kanban/cards/cards.entity';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { hashPasswordTransform } from '../common/helpers/crypto';

@ObjectType()
@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    transformer: hashPasswordTransform,
  })
  @HideField()
  password: string;

  @OneToMany(() => Card, (card: Card) => card.user)
  cards: Card[];
}
