import React from 'react'

function page({ params }: any) {
    console.log(params)

    return (
        <div>
            hey,{params.username}
        </div>
    )
}

export default page
