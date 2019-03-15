const Post = {
  id: 1,
  posts: [
    {
      id: 1,
      title: '제목',
      body: '내용',
    },
  ],
  create({ title, body }) {
    this.id += 1;
    const post = {
      id: this.id,
      title,
      body,
    };

    this.posts.push(post);

    return post;
  },
  getPostIndex(id) {
    // id로 posts index 조회
    return this.posts.findIndex(post => post.id === id);
  },
  findPostById(id) {
    // id로 host 조회
    return this.posts.find(post => post.id === id);
  },
  removePostById(id) {
    // id로 포스트 제거
    // const index = this.getPostIndex(id);
    // this.posts.splice(index, 1);
    this.posts = this.posts.filter(post => post.id !== id);
  },
  updatePost(id, data, replace) {
    // id로 포스트를 업데이트하거나 교체함.
    const index = this.getPostIndex(id);

    if (replace) {
      this.posts[index] = {
        ...data,
        id,
      };
    } else {
      this.posts[index] = {
        ...this.posts[index],
        ...data,
        id,
      };
    }

    return this.posts[index];
  },
};

exports.write = (ctx) => {
  const post = Post.create(ctx.request.body);
  ctx.body = post;
};
exports.list = (ctx) => {
  ctx.body = Post.posts;
};
exports.read = (ctx) => {
  const id = parseInt(ctx.params.id, 10);

  ctx.body = Post.findPostById(id);
};
exports.remove = (ctx) => {
  const id = parseInt(ctx.params.id, 10);

  Post.removePostById(id);
  ctx.status = 204;
};
exports.replace = (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const post = Post.updatePost(id, ctx.request.body, true);

  ctx.body = post;
};
exports.update = (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const post = Post.updatePost(id, ctx.request.body, false);

  ctx.body = post;
};
