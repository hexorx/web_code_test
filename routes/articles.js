
/*
 * GET articles.
 */

exports.list = function(req, res){
  res.render('articles', { title: 'Articles' });
};