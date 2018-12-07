import React, { Component } from "react";
import ReactDOM from "react-dom";
import GoogleMapReact from "google-map-react";
import "./App.css";
import marker from "./marker.png";

const CenterMarker = () => (
  <div>
    <img width="40" height="40" alt="centerMarker" src={marker} />
  </div>
);
class App extends Component {
  constructor() {
    super();
    this.state = {
      center: {
        lat: 59.95,
        lng: 30.33
      },
      radius: 10,
      zoom: 11,
      address: ""
    };
  }
  componentDidMount() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(this.setLocation);
    } else {
      console.log("GeoLocation is not supported");
    }
  }
  onMapLoad = () => {
    var input = ReactDOM.findDOMNode(this.refs.address);
    console.log(window.google.maps);
    var autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.addListener("place_changed", () => {
      var place = autocomplete.getPlace();
      console.log(autocomplete);
      console.log(place);
      if (place.geometry) {
        this.setState({
          center: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        });
      }
    });
  };
  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    window.google.maps.event.clearInstanceListeners(this.searchBox);
  }
  calculateDistance = (lat1, lon1, lat2, lon2) => {
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 3958.7558657440545; // Radius of earth in Miles
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d);
  };
  toRad(Value) {
    /** Converts numeric degrees to radians */
    return (Value * Math.PI) / 180;
  }
  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  setLocation = location => {
    this.setState({
      center: {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }
    });
  };
  render() {
    return (
      <div className="App">
        <div style={{ height: "70vh", width: "100vw" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyDs39h2u7BBlxTC1cqnwmtFp1mHVa4nzZ4"
            }}
            center={this.state.center}
            options={{ mapTypeControl: true, streetViewControl: true }}
            defaultZoom={this.state.zoom}
            onGoogleApiLoaded={this.onMapLoad}
          >
            <CenterMarker
              lat={this.state.center.lat}
              lng={this.state.center.lng}
            />
          </GoogleMapReact>
        </div>

        <input
          onChange={this.onChange}
          id="address"
          value={this.state.address}
          name="address"
          ref="address"
        />
        <h3>
          You are at: <br />
          {this.state.center.lat.toFixed(6)}, {this.state.center.lng.toFixed(6)}
          <br />
          <a
            href={`https://earth.google.com/web/@${this.state.center.lat},${
              this.state.center.lng
            },641.30335831a`}
            target="_blank"
          >
            Visit on Google Earth
          </a>
        </h3>
      </div>
    );
  }
}

export default App;
