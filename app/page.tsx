export default async function Page() {
  return (
    <div className='mt-auto max-w-md gap-20 pb-10 text-sm'>
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
    </div>
  )
}
