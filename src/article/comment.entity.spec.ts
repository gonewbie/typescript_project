import { Comment.Entity } from './comment.entity';

describe('Comment.Entity', () => {
  it('should be defined', () => {
    expect(new Comment.Entity()).toBeDefined();
  });
});
