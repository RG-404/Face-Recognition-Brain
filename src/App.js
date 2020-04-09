import React, { useState } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css';

const app = new Clarifai.App({
  apiKey: 'd403212010154182b06cc1a0487c9996'
});

const paraticlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 750
      }
    }
  }
}

function App() {

  const [input, setinput] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  const [box, setbox] = useState({});
  const [route, setroute] = useState('signin')
  const [isSignedIn, setisSignedIn] = useState(false)

  const onInputChange = (event) => {
    setinput(event.target.value)
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setbox(box);
  }

  const requestClarifai = () => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => {
        displayFaceBox(calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  const onButtonSubmit = () => {
    setimageUrl(input);
    requestClarifai();
  }

  const onRouteChange = (route) => {
    if(route === 'signin' || route==='register') {
      setisSignedIn(false)
    }else if(route==='home'){
      setisSignedIn(true)
    }
    setroute(route);
  }

  return (
    <div className="App">

      <Particles className='particles'
        params={paraticlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      {route === 'home' ?
        (
          <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition imageUrl={imageUrl} box={box} />
        </div>
          
        )
        :
        (
          route ==='signin' ? 
          <Signin onRouteChange={onRouteChange}/>
          :
          <Register onRouteChange={onRouteChange}/>
        )
      }
    </div>
  );
}

export default App;
