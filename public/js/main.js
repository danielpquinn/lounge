
// Bootstrap react app when page is ready

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    React.createElement(LOUNGE.components.App),
    document.getElementById('app')
  );
});