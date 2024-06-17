import Link from 'next/link'
import 'photoswipe/dist/photoswipe.css'

export default async function Page() {
  return (
    <>
      <div className='flex min-h-screen items-start gap-4 px-4 pt-8 md:gap-8 md:px-8'>
        <div className='sticky top-8 w-20 shrink-0 text-sm'>
          <h1 className='flex items-center gap-2'>
            <span className='block h-px w-full bg-black'></span>
            Lubbock
          </h1>
          <Link className='flex items-center gap-2 underline-offset-2 hover:underline' href='/carousel'>
            Carousel
          </Link>
          <Link className='flex items-center gap-2 underline-offset-2 hover:underline' href='/grid'>
            Grid
          </Link>
        </div>

        <main className='mt-auto flex items-end gap-20 pb-10'>
          <section className='max-w-md text-sm'>
            <h2 className='font-bold'>About</h2>
            <p className='mt-2'>Lubbock is an amateur black and white street photographer based in Bordeaux.</p>
            <p className='mt-2'>Photography has been his passion since 1998.</p>
            <p className='mt-2'>
              Five themes recur frequently in his photos: street photography, underground photography, architecture and
              photography in rain or fog.
            </p>

            <h2 className='mt-8 font-bold'>Contact</h2>
            <nav className='mt-2 flex gap-2'>
              <a className='hover:underline' href='https://500px.com/p/lubbock?view=photos'>
                500px
              </a>
              <a className='hover:underline' href='https://www.flickr.com/photos/lubbockphotos/'>
                Flickr
              </a>
              <a className='hover:underline' href='https://instagram.com/lubbock_photos/'>
                Instagram
              </a>
            </nav>
          </section>
        </main>
      </div>
    </>
  )
}
