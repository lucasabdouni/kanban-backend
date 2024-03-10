import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/cards.entity';

@ObjectType()
@Entity()
export class ColumnTable {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  title: string;

  @OneToMany(() => Card, (card: Card) => card.columnsTable)
  public cards: Card[];
}
