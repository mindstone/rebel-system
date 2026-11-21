---
name: image-edit
description: "Use first to resize, crop, rotate, compress or convert an image (JPEG, PNG, WebP, AVIF, TIFF, GIF), or to check its size and format, offline with Rebel's built-in image library. For example: shrink photos for an email, make a square profile picture, or turn a PNG into a JPEG."
last_updated: 2026-11-21
tools_required: '["Node.js (bundled with Rebel)"]'
---

# Resize, crop and convert images

## [GOAL]

Change an image the way the user asked, without installing anything, and keep their original untouched.

## [PROCESS]

1. Look at the image first, quoting paths:
   ```bash
   node "rebel-system/skills/utilities/image-edit/scripts/image.cjs" info "photo.jpg"
   ```
   It prints the format, the width and height as the picture is seen (upright), the number of frames and the file size.
2. Write the result to a new file; the output's extension picks the format. Options, all optional:
   - `--width N`, `--height N`: the box to fit in, in pixels. With `--fit inside` (the default) the whole picture fits and is never enlarged; `cover` fills the box and trims the edges (a square profile picture: `--width 400 --height 400 --fit cover`); `contain` fits and pads with white; `fill` stretches.
   - `--crop left,top,width,height`: cut out a part, in pixels of the upright picture.
   - `--rotate 90`: turn clockwise, in degrees.
   - `--grayscale`, and `--quality 1-100` for JPEG, WebP and AVIF (80 is a good size for email).
   ```bash
   node "rebel-system/skills/utilities/image-edit/scripts/image.cjs" edit "photo.jpg" "photo-small.jpg" --width 1600 --quality 80
   ```
3. Check the printed size and dimensions against what the user wanted, look at the image if the result matters visually, and link the new file.

Every output is turned upright by the camera's orientation tag. Location, camera and other metadata are removed from the output, which is usually wanted before sharing; say so if the user might expect it kept. Converting to JPEG turns transparent areas white, and an animated GIF or WebP keeps its animation only as GIF or WebP (it can be resized and cropped, but not turned; to turn its first frame, write a .png or .jpg). The script refuses to overwrite an existing file; pick a new name.

HEIC photos (the iPhone default) can't be read: ask for a JPEG export. If the bundle is missing, report the installation problem; do not install packages.
