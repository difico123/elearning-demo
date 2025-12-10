import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentType, TableName } from 'database/constant';
import { DeleteResult, getManager, Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async saveComment(comment: Partial<Comment>): Promise<Comment> {
    try {
      return this.commentRepository.save(comment);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteComment(id: number): Promise<DeleteResult> {
    try {
      return this.commentRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findOneById(id: number): Promise<Comment> {
    try {
      return this.commentRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findComments(type: CommentType, sourceId: number) {
    const entityManager = getManager();
    let c = TableName.comment;
    let u = TableName.user;

    let select = `${c}.*, ${u}.username, ${u}.email, ${u}.role, ${u}.avatar`;
    let query = `SELECT ${select}
    FROM ${c} JOIN ${u} ON ${u}.id=${c}.userId  
    WHERE ${c}.type = ? and ${c}.sourceId = ?`;
    try {
      const resultItems = await entityManager.query(query, [type, sourceId]);

      return resultItems;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findCommentors(type: CommentType, sourceId: number): Promise<string[]> {
    const entityManager = getManager();
    let query = `SELECT ${TableName.comment}.userId 
      FROM ${TableName.comment}
      WHERE type = ? and sourceId = ?
      GROUP BY ${TableName.comment}.userId
      `;
    try {
      const resultItems = (await entityManager.query(query, [
        type,
        sourceId,
      ])) as { userId: string }[];

      let result = resultItems.map((item) => item.userId);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existComment(id: number): Promise<Comment> {
    let existCourse = await this.findOneById(id);
    if (!existCourse) {
      throw new NotFoundException('Not found comment');
    }
    return existCourse;
  }
}
