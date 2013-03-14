$(function () {
  // View
  var View = function (template, events) {
    this.template = template;
    this.events = events;

    // Render
    this.render = function (view) {
      var compiled_template = $(template).text();
      $('#view').html(Mustache.render(compiled_template, view));

      // Attache events
      _.defer( function () {
        if (typeof(events) === 'object') {
          _(events).each( function(callback, el) {
            var event = 'click';
            if (typeof(callback) === 'array') {
              event = callback[0];
              callback = callback[1];
            }
            console.log($('#view').find('#test-link'));
            console.log(callback);
            $('#view').find(el).on(event, callback);
          })
        }
      });
    }
  }

  // Article
  var Article = function (data) {
    $.extend(this, data)
    this.favorite = function () {
      console.log('favorited', this)
    }
  }

  Article.all = function (callback) {
    $.getJSON('http://localhost:3000/articles', function (data) {
      var results = $.map(data.articles, function(article) {
        return new Article(article);
      });
      callback(false, results);
    });
  }

  var ArticlesView = new View('#articles-template', {
    '#test-link': function (ev, data) {
    }
  });

  var App = {
    init: function () {
      Article.all(function (err, articles) {
        if (!err) {
          ArticlesView.render({articles: articles});
        }
      });
    }
  }

  App.init();
  window.Article = Article;
});

