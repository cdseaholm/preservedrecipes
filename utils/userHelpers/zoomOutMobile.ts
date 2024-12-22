export default function ZoomOutMobile({ deviceWidth, max }: { deviceWidth: number, max: boolean }) {
    var viewport = document.querySelector('meta[name="viewport"]');
    const stringWidth = deviceWidth.toString();
    if (viewport) {
        if (max) {
            viewport.setAttribute('content', `width=${stringWidth}, initial-scale=1, maximum-scale=1, user-scalable=no`);
        } else {
            viewport.setAttribute('content', `width=${stringWidth}, initial-scale=1, maximum-scale=10, user-scalable=yes`);
        }
    }
}