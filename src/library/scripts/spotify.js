// Spotify Embed Loader
document.addEventListener('DOMContentLoaded', function() {
    const loadSpotify = () => {
      const theme = document.body.classList.contains('dark-mode') ? 'theme=0' : 'theme=1';
      // Replace with your Spotify playlist/album/track URI
      const spotifyUri = 'https://open.spotify.com/playlist/50wikqehaUR5wsdWWp2NpP?si=3987e6e307724171'; // Example playlist
      const embedUrl = `https://open.spotify.com/embed/${spotifyUri.replace('spotify:', '')}?${theme}`;
      
      document.getElementById('spotify-player').src = embedUrl;
    };
  
    // Load initially
    loadSpotify();
  
    // Update on theme change
    const darkModeObserver = new MutationObserver(loadSpotify);
    darkModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  });