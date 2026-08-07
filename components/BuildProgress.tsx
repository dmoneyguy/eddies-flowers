// BuildProgress — photographs of the actual shop at 23 Rindge State Road.
//
// WHY. Eleven images ship with this site and not one of them is the building.
// For a business that cannot legally sell anything yet, the build IS the
// content, and it is the most persuasive content available: one photo of the
// real place does more than any paragraph of copy.
//
// HOW TO ADD PHOTOS — no code required.
//   Drop image files into  public/photos/  and redeploy. That's it.
//   • Any .jpg / .jpeg / .png / .webp / .avif is picked up automatically.
//   • They appear in filename order, so name them 01-, 02-, 03- to control it.
//   • Give a photo a caption by adding a line to public/photos/captions.json:
//         { "01-storefront.jpg": "The front, the week the sign went up." }
//     Captions are optional; a photo with none just shows without one.
//   • The FIRST photo is treated as the hero shot and rendered large.
//
// IF THE FOLDER IS EMPTY THIS SECTION RENDERS NOTHING AT ALL. No placeholder,
// no grey box, no "coming soon" card. A missing photo should be invisible, not
// a hole in the page — the previous location section shipped a 380px empty
// card and that is exactly the failure mode being avoided here.
//
// The directory is read at build time on the server, so there is no runtime
// cost and no client JavaScript.

import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const PHOTO_DIR = path.join(process.cwd(), "public", "photos");
const EXT = /\.(jpe?g|png|webp|avif)$/i;

type Photo = { src: string; caption: string | null; alt: string };

function readPhotos(): Photo[] {
  let files: string[];
  try {
    files = fs.readdirSync(PHOTO_DIR).filter((f) => EXT.test(f)).sort();
  } catch {
    return []; // folder doesn't exist yet — render nothing
  }
  if (files.length === 0) return [];

  let captions: Record<string, string> = {};
  try {
    captions = JSON.parse(
      fs.readFileSync(path.join(PHOTO_DIR, "captions.json"), "utf8"),
    );
  } catch {
    // no captions file, or malformed — photos still render, just uncaptioned
  }

  return files.map((f) => {
    const caption = typeof captions[f] === "string" ? captions[f]! : null;
    return {
      src: `/photos/${f}`,
      caption,
      // Alt text has to describe something. Fall back to a truthful generic
      // rather than shipping an empty alt on meaningful content.
      alt:
        caption ||
        "Eddie's Flowers Dispensary under construction at 23 Rindge State Road, Ashburnham, Massachusetts",
    };
  });
}

export function BuildProgress() {
  const photos = readPhotos();
  if (photos.length === 0) return null;

  const [hero, ...rest] = photos;

  return (
    <section id="the-build" className="bg-cream px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p
          data-reveal
          className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-deep"
        >
          The build
        </p>
        <h2
          data-reveal
          className="display mt-4 text-balance text-center text-3xl font-medium text-charcoal-black sm:text-4xl"
        >
          It&apos;s a{" "}
          <span className="italic font-light text-leaf-green-deep">real place</span>,
          and it&apos;s nearly finished.
        </h2>
        <p
          data-reveal
          className="mx-auto mt-4 max-w-xl text-balance text-center text-base text-charcoal-black/70"
        >
          23 Rindge State Road, Ashburnham. Here&apos;s how it&apos;s coming along.
        </p>

        <figure data-reveal className="mt-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-charcoal-black/5 shadow-[0_30px_70px_-30px_rgba(43,43,43,0.45)] sm:aspect-[16/9]">
            <Image
              src={hero!.src}
              alt={hero!.alt}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority={false}
            />
          </div>
          {hero!.caption && (
            <figcaption className="mt-3 text-center text-sm text-charcoal-black/60">
              {hero!.caption}
            </figcaption>
          )}
        </figure>

        {rest.length > 0 && (
          <div
            data-reveal
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {rest.map((photo) => (
              <figure key={photo.src}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-charcoal-black/5">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
                {photo.caption && (
                  <figcaption className="mt-2 text-xs leading-snug text-charcoal-black/55">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
