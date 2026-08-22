export function resetZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
    }
}

export function preventZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
    }
}

export default function ZoomOutMobile({ deviceWidth: _deviceWidth, preventZoom = false }: { deviceWidth: number, preventZoom?: boolean }) {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (!viewport) return;

    const content = preventZoom
        ? 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        : 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    
    viewport.setAttribute('content', content);
}
