
import {
  bootstrapCameraKit,
  CameraKitSession,
  createMediaStreamSource,
  //Transform2D,
} from '@snap/camera-kit';

// Import the AR handler
import './model-viewer-ar';


// Store the current session
let currentSession: CameraKitSession;

let mediaStream: MediaStream;


const liveRenderTarget = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

async function init() {
  const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUyNDkyMzM3LCJzdWIiOiJlMDA1YTEzMy1jNmNlLTRmNmUtYjMyMC05YTNkYzVjOTRlZTN-U1RBR0lOR35mZjZkOGU3OC0xZWYzLTQ3ZWUtOGY0ZC1lM2Y5MDZjOTZlZTEifQ.yf7OFtk9dhdjq8FsmXghKNea_7GMoBF01AGEpTVj6ZY' });
  currentSession = await cameraKit.createSession({ liveRenderTarget });
  const lenses = await cameraKit.lensRepository.loadLens('10573a22-a9e2-495c-9294-f917c95f7e37',
    'c352182f-89be-4007-b24c-8fcf50c56d56'
  );

  currentSession.applyLens(lenses);

  // Remove fullscreen class after lens is loaded
  liveRenderTarget.classList.remove('fullscreen');

  await setCameraKitSource(currentSession);
}

async function setCameraKitSource(
  session: CameraKitSession) {

  mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  const source = createMediaStreamSource(mediaStream, { cameraType: 'environment' });

  await session.setSource(source);

  // source.setTransform(Transform2D.MirrorX);



  session.play();
}
init();

// Carousel functionality for model switching
function initCarousel() {
  const viewer = document.getElementById('shoe-viewer') as any;
  const buttons = document.querySelectorAll('.variant-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from all buttons
      buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      // Set active state on clicked button
      btn.setAttribute('aria-pressed', 'true');
      // Change model source
      const newSrc = btn.getAttribute('data-src');
      if (newSrc && viewer) {
        viewer.setAttribute('src', newSrc);
        console.log('Switched to model:', newSrc);
      }
    });
  });
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
});

