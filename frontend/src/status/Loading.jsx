import React from 'react'
import { DotLottiePlayer } from "@dotlottie/react-player";

const Loading = () => {
  return (
    <div className='h-'>

        <DotLottiePlayer
      src="https://lottie.host/32b29e0c-836c-4ad3-b292-c8e4e7a6c126/vkk8oaPjbu.lottie"
      loop
      autoplay
      className='h-[500px]'
    />
    </div>
  )
}

export default Loading