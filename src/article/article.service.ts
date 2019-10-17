import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { Repository, getRepository } from 'typeorm';
import { Comment } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CreateArticleDto } from './dto';

const slug = require('slug');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}

  async findAll(query): Promise<ArticlesRO> {
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    qb.where('1 = 1');

    if ('tag' in query) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%`});
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({ username: query.favorited });
      qb.andWhere('article.authorId = :id', { id: author.id });
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({ username: query.favorited });
      const ids = author.favorites.map(el => el.id);
      qb.andWhere('article.authorId IN (:ids)', { ids });
    }

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return { articles, articlesCount };
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });

    const comment = new Comment();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepository.save(comment);
    article = await this.articleRepository.save(article);
    return { article };
  }

  async create(userId: number, articleData: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['articles'] });

    if (Array.isArray(author.articles)) {
      author.articles.push(article);
    } else {
      author.articles = [article];
    }

    await this.userRepository.save(author);

    return newArticle;
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
  }
}
