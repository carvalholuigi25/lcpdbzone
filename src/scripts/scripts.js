// const toastLiveExample = document.getElementById('liveToast')

// if (toastLiveExample) {
//   const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
//     toastBootstrap.show();
// }

function loadVideoPlayer() {
  const id = 'my-video';

  if (document.getElementById(id)) {
    const player = window.videojs(document.querySelectorAll("#" + id)[0], {
      controls: true,
      autoplay: false,
      fluid: true,
      responsive: true,
      preload: 'auto',
    });

    player.ready(function () {
      console.log('Video.js is ready!');
    });

    player.on('play', function () {
      console.log('Video is playing!');
    });

    player.on('pause', function () {
      console.log('Video is paused!');
    });

    player.on('ended', function () {
      console.log('Video has ended!');
    });

    player.on('error', function () {
      console.error('An error occurred while playing the video.');
    });
  }
}


loadVideoPlayer();
