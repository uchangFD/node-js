const Post = require('models/posts');
const { ObjectId } = require('mongoose').Types;
const Joi = require('joi');

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next();
};

exports.write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;

  const scheme = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = Joi.validate(ctx.request.body, scheme);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;

    return;
  }

  const post = new Post({
    title,
    body,
    tags,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
exports.list = async (ctx) => {
  const page = parseInt(ctx.query.page || 1, 10);

  try {
    const posts = await Post.find()
      .sort({ id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();

    const postCounts = await Post.countDocuments().exec();

    ctx.set('Last-page', Math.ceil(postCounts / 10));
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};
exports.read = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
exports.remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
exports.update = async (ctx) => {
  const { id } = ctx.params;

  const scheme = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = Joi.validate(ctx.request.body, scheme);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;

    return;
  }

  try {
    const post = Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();

    if (!post) {
      ctx.status = 204;
      return;
    }

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
