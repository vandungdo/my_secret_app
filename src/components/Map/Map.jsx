import React from "react";
import Plot from 'react-plotly.js';

class Map extends React.Component {
   
    // Constructor 
    constructor(props) {
        super(props);
   
        this.state = {
            dataFromApi: [],
            dataFromApiisLoaded: false
        };

    }
    
    componentDidMount() {
        fetch(
"https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?limit=100&page=1&offset=0&sort=desc&has_geo=true&radius=1000&country_id=DE&order_by=lastUpdated&dumpRaw=false")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    dataFromApi: json.results,
                    dataFromApiisLoaded: true
                });
            })
    }
  
    render() {


      // data for the map: [{type, name, lat, lon},{}...]
      var data = []
      
      this.state.dataFromApi.forEach((d) => {
        var infoObj = {}
        if (d.city != null) {
          infoObj['type'] = 'scattermapbox';
          infoObj['name'] = d.city;
          infoObj['lat'] = d.coordinates.latitude;
          infoObj['lon'] = d.coordinates.longitude;
          data.push(infoObj)
        }
      })
      console.log(data)

      var layout = {
          title: 'German cities environment measurements',
          font: {
            color: 'white'
          },
          dragmode: 'zoom',
          mapbox: {
            center: {
              lat: 52.489451,
              lon: 13.430844
            },
            domain: {
              x: [0, 1],
              y: [0, 1]
            },
            style: 'light',
            zoom: 5
          },
          margin: {
            r: 20,
            t: 40,
            b: 20,
            l: 20,
            pad: 0
          },
          paper_bgcolor: '#191A1A',
          plot_bgcolor: '#191A1A',
          showlegend: true,
          annotations: [{
              x: 0,
              y: 0,
              xref: 'paper',
              yref: 'paper',
              text: 'Source: <a href="https://docs.openaq.org/v2/measurements" style="color: rgb(255,255,255)">Environmental Measurements</a>',
              showarrow: false
          }]
        };
     
      return (
        <div>
          <Plot 
            data = {data}
            layout = {layout}
            config={{mapboxAccessToken: 'pk.eyJ1IjoidmFuZHVuZ2RvIiwiYSI6ImNsMW5yZ2I3YzBzbW0zY3FyNWNnbXQ3ZnkifQ.WqALjHnOnwCvEWSXhXGumQ'}}
          />  
        </div>
      );
    }
}
   
export default Map;