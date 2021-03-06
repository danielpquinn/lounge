
// Expands links into various formats

// Dependencies

function Expander() {}

Expander.youtube = function (input) {
  var videoId = input.match(/v=(.+)/);
  if (videoId) { videoId = videoId[1]; }
  return input.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="240" height="200" src="http://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');
};

Expander.image = function (input) {
  return input.replace(/(https?:\/\/.+(\.jpe?g|\.png|\.gif))/, '<span style="display: inline-block; max-width: 240px;"><img style="width: 100%" src="$1"/></span>');
};

// Exports

module.exports = Expander;