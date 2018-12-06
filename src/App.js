import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import './App.css';
import radiotower from "./radio-tower.png";
const AnyReactComponent = ({ radius,distance }) => <div>{distance > radius ? <img width="30" height="30" style={{display:'none'}} src={radiotower}/> : <img width="30" height="30" style={{display:'block'}} src={radiotower}/> }</div>;
class App extends Component {
  constructor(){
    super();
    this.state = {
      center: {
        lat: 59.95,
        lng: 30.33
      },
      radius: 10,
      zoom: 11,
      address: '',
    };
  }
  componentDidMount(){
    if(window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition(this.setLocation);
     console.log(radiotower);
    }else{
      console.log('GeoLocation is not supported');
    }
    
  }
  onMapLoad = () => {
    var input = ReactDOM.findDOMNode(this.refs.address);
    console.log(window.google.maps);
    var autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
     
     var place = autocomplete.getPlace();
     if(place.geometry){
      this.setState({
        center:{
          lat:place.geometry.location.lat(),
          lng:place.geometry.location.lng()
        }
      })
     }
    });
  }
  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    window.google.maps.event.clearInstanceListeners(this.searchBox);
  }
  calculateDistance = (lat1, lon1, lat2, lon2) => {
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 3958.7558657440545; // Radius of earth in Miles 
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return Math.round(d);
  }
  toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}
  onChange = event => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }
  setLocation = (location) => {
    
    this.setState({
      center:{
        lat:location.coords.latitude,
        lng:location.coords.longitude
      }
    })
  }
  render() {
    const towers = [/* 
      {lat:24.98962229,lng: 67.08173247},
      {lat:24.93376927,lng: 66.96448038},
      {lat:25.00279251,lng: 67.00373437},
      {lat:24.89395837,lng: 67.07979735},
      {lat:24.78524966,lng: 66.99281317},
      {lat:24.97488713,lng: 66.97712422},
      {lat:24.95752404,lng: 66.91460901},
      {lat:24.8829257,lng: 67.13000474},
      {lat:24.87354415,lng: 67.03703935},
      {lat:24.75132031,lng: 67.02778418}, */
    ];
    return (
      <div className="App">
        <div style={{height:"500px",width:"1000px"}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDs39h2u7BBlxTC1cqnwmtFp1mHVa4nzZ4" }}
          center={this.state.center}
          defaultZoom={this.state.zoom}
          onGoogleApiLoaded ={this.onMapLoad}
        >
      {towers.map(tower => (
       
          <AnyReactComponent
              lat={tower.lat}
              lng={tower.lng}
              distance={this.calculateDistance(this.state.center.lat,this.state.center.lng,tower.lat,tower.lng)}
              radius={this.state.radius}
            />)
      )}
        </GoogleMapReact>
        </div>
        <input onChange={this.onChange} id="radius" value={this.state.radius} name="radius" />
        <input onChange={this.onChange} id="address" value={this.state.address} name="address" ref="address" />
      </div>
    );
  }
}

export default App;
