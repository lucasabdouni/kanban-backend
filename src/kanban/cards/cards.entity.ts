import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnTable } from '../columns/columns.entity';

@ObjectType()
@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(
    () => ColumnTable,
    (columnTable: ColumnTable) => columnTable.cards,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'ColumnTableId' })
  columnsTable: ColumnTable;

  @ManyToOne(() => User, (user: User) => user.cards, {
    eager: true,
  })
  @JoinColumn({ name: 'UserId' })
  user: User;
}
