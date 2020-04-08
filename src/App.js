import React, { useState } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
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

  const onInputChange = (event) => {
    setinput(event.target.value)
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
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
    console.log(box);
    setbox(box);
  }

  const requestClarifai = () => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then( response => {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        displayFaceBox(calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  const onButtonSubmit = () => {
    setimageUrl(input);
    requestClarifai();
  }

  return (
    <div className="App">
      <Particles className='particles'
        params={paraticlesOptions} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      <FaceRecognition imageUrl={imageUrl} box={box}/>
    </div>
  );
}

export default App;
