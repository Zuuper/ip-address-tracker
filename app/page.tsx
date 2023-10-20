'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import IconArrow from '@/public/icons/icon-arrow.svg'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { setupFsCheck } from 'next/dist/server/lib/router-utils/filesystem'



type Location = {
  country: string,
  region: string,
  city: string,
  lat: number,
  lng: number,
  postalCode: string,
  timezone: string,
  geonameId: number
}
type ServiceProviderDetail = {
  asn: number,
  name: string,
  route: string,
  domain: string,
  type: string
}
interface IpAddress {
  ip: string,
  location: Location,
  as: ServiceProviderDetail,
  isp: string
}

// TODO TOMORROW 
// 1. finising API Call
// 2. map implementation
// 3. make it look nice
export default function Home() {
  const [ipAddress, setIpAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState<IpAddress>()
  const addressDetailElement = useRef<HTMLDivElement>(null)
  const [coordinate, setCoordinate] = useState<LatLngExpression>([-8.5097, 115.2004])
  const [isLoading, setLoading] = useState(false)


  const handleIpSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch(`api/ip-address?ip=${ipAddress}`, {
        method: 'GET'
      })
      const data = await response.json() as IpAddress
      setAddressDetail(data)
      setCoordinate([data.location.lat, data.location.lng])
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message)
      }
      else {
        alert(err)
      }
    }
    setLoading(false)

  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between h-screen">
      <section className='relative p-8 h-[45%] md:h-[30%] bg-purple-500 w-full'>
        <h1 className='text-2xl text-center text-white font-semibold mb-4'>IP Address Tracker</h1>
        <div className='bg-white rounded-lg flex max-w-md mx-auto'>
          <input type="text" className='p-4 rounded-lg w-full focus:outline-none' placeholder='ip address ' value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
          <button onClick={handleIpSearch} className='aspect-square h-full bg-black p-4 rounded-r-lg'>
            <Image src={IconArrow} alt='arrow-icon' width={24} height={24} />
          </button>
        </div>
        {isLoading ? <p className='z-[999] p-4 bg-white shadow-md flex items-center w-24 h-24 absolute left-1/2 -translate-x-1/2 -bottom-12 rounded-lg font-semibold'>Loading...</p> : <></>}
        {(addressDetail && !isLoading) ?
          <div ref={addressDetailElement} className={` max-sm:text-center z-[999] p-4 md:p-6 grid grid-cols-1 max-sm:w-[80%] w-[60%] md:grid-cols-4 gap-4 absolute left-1/2 -translate-x-1/2 bg-white rounded-lg max-sm:h-72 h-32 -bottom-16 max-sm:-bottom-36`}>
            <div className='text-lg font-semibold md:border-r-2 '>
              <p className='text-sm text-gray-500 md:mb-2 leading-none'>IP Address</p>
              <p>{addressDetail.ip ?? '-'}</p>
            </div>
            <div className='text-lg font-semibold md:border-r-2 '>
              <p className='text-sm text-gray-500 md:mb-2 leading-none'>Location</p>
              <p>{addressDetail.location.country ?? '-'}, {addressDetail.location.city ?? '-'}</p>
            </div>
            <div className='text-lg font-semibold md:border-r-2 '>
              <p className='text-sm text-gray-500 md:mb-2 leading-none'>Timezone</p>
              <p>UTC {addressDetail.location.timezone ?? '-'}</p>
            </div>
            <div className='text-lg font-semibold '>
              <p className='text-sm text-gray-500 md:mb-2 leading-none'>ISP</p>
              <p className='leading-snug'>{addressDetail.isp ?? '-'}</p>
            </div>
          </div> : <></>
        }
      </section>
      <section className='h-[55%] md:h-[70%] bg-red-300 w-full'>
        <Map position={coordinate} />
      </section>
    </main>
  )
}

type MapProps = {
  position: LatLngExpression
}
function Map({ position }: MapProps) {
  const [coordinate, setCoordinate] = useState<LatLngExpression>(position)
  useEffect(() => {
    setCoordinate(position)
  }, [position])
  return <MapContainer center={coordinate} zoom={13} scrollWheelZoom style={{ minHeight: '200px', minWidth: '200px', height: '100%', width: '100%' }}>

    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
    <Marker position={position} />
  </MapContainer>

}
