import { ArticleEntity } from './article.entity';

describe('Article.Entity', () => {
  it('should be defined', () => {
    expect(new ArticleEntity()).toBeDefined();
  });
});
