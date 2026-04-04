export function resetZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes');
    }
}

export function preventZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
}

export default function ZoomOutMobile({ deviceWidth, preventZoom = false }: { deviceWidth: number, preventZoom?: boolean }) {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (!viewport) return;

    const content = preventZoom
        ? `width=${deviceWidth}, initial-scale=1, maximum-scale=1, user-scalable=no`
        : `width=${deviceWidth}, initial-scale=1, maximum-scale=10, user-scalable=yes`;
    
    viewport.setAttribute('content', content);
}