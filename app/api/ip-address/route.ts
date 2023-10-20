import { NextRequest, NextResponse } from "next/server"

export async function GET(request:NextRequest){
  const searchParam = request.nextUrl.searchParams
  const query = searchParam.get('ip')
  if(!query){
    return new Response('Ip address is missing',{status:400, statusText:'bad request'})
  }
  const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_J5yATtYR8ZJ3PJxEogK5IP0hBOxQb&ipAddress=${query}`)
  const data = await res.json()
  console.log(request.json())
  return NextResponse.json(data)

} 