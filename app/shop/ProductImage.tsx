'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductImage({ src, alt }: { src: string; alt: string }) {
const [open, setOpen] = useState(false)

return (
<>
<button
type="button"
onClick={() => setOpen(true)}
className="relative aspect-square w-full block"
>
<Image src={src} alt={alt} fill unoptimized className="object-cover" />
</button>
{open && (
<div
onClick={() => setOpen(false)}
className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
>
<img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
</div>
)}
</>
)
}
