/**
 * Product image wrapper — 3D viewer has been removed per PRD.
 * Photography only. This component now just passes through the image gallery.
 */

interface Product3DToggleProps {
  imageGallery: React.ReactNode;
  show3D?: boolean;
}

export function Product3DToggle({ imageGallery }: Product3DToggleProps) {
  return <>{imageGallery}</>;
}
