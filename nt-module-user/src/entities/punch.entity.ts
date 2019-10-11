import moment from 'moment';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { User } from './user.entity';

@Entity('punch')
export class Punch {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.punchList, {
        onDelete: 'CASCADE'
    })
    user: string;
    
    @Column({
        nullable: true
    })
    type: string;

    @Column({
        nullable: true
    })
    time: string;

    @Column({
        nullable: true
    })
    result: string;

//     @CreateDateColumn({
//         transformer: {
//             from: (date: Date) => {
//                 return moment(date).format('YYYY-MM-DD HH:mm:ss');
//             },
//             to: () => {
//                 return new Date();
//             }
//         }
//     })
//     createdAt: string;

//     @UpdateDateColumn({
//         transformer: {
//             from: (date: Date) => {
//                 return moment(date).format('YYYY-MM-DD HH:mm:ss');
//             },
//             to: () => {
//                 return new Date();
//             }
//         }
//     })
//     updatedAt: string;
 }