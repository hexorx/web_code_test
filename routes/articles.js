
/*
 * GET articles.
 */
var superagent = require('superagent');

exports.list = function(req, res){
  var agent = superagent.agent();
  res.format({
    html: function(){
        res.render('articles', { title: 'Articles' });
      },
    json: function(){
        agent.get('https://healthnews-feature-9.itriagehealth.com/api/v1/healthnews/preferred_articles.json?content=lite&installation_id=test1&security_token=3ad9f621b96ce164dcea759fa11166cd6cc659ec').end(function (data) {
          res.send(data.body);
        });
      }
  });
};
