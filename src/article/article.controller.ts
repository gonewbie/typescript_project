import { Controller, Get, Query, Body, Post, Param } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ApiUseTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArticlesRO } from './article.interface';
import { User } from '../user/user.decorator';
import { CreateArticleDto, CreateCommentDto } from './dto';

@ApiBearerAuth()
@ApiUseTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ title: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @ApiOperation({ title: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('article') articleData: CreateArticleDto) {
    return await this.articleService.create(userId, articleData);
  }

  @ApiOperation({ title: 'Create comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  async createComment(@Param('slug') slug, @Body('comment') commentData: CreateCommentDto) {
    return await this.articleService.addComment(slug, commentData);
  }
}
