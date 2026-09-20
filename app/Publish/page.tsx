import React, { Suspense } from 'react'
import Navbar from '../Navbar/Navbar'
import ApiPublish from './ApiPublish'

const page = () => {
  return (
    <div>
        <Navbar/>
            <Suspense fallback={null}>

        <ApiPublish/>
            </Suspense>

    </div>
  )
}

export default page