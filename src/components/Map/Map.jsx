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

      const apiEndpoint = "https://docs.openaq.org/v2/measurements?date_from=2000-01-01T00%3A00%3A00%2B00%3A00&     date_to=2022-04-08T13%3A46%3A00%2B00%3A00&limit=100&page=1&offset=0&sort=desc&radius=1000&country_id=DE&order_by=datetime";
        fetch(apiEndpoint)
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    dataFromApi: json.results,
                    dataFromApiisLoaded: true
                });
            })
    }

    transformData (data) {
      const parameters = ["um025", "um100", "pm25", "pm10", "um010", "pm1"]
      const colors = ['#FF6633', '#E6B333', '#80B300', '#FF99E6', '#66664D', '#FF3380']

      let plotData = []

      for (let i=0; i< parameters.length; i++) {
        let location = [];
        let date = [];
        let lat = [];
        let lon = [];
        let parameter = [];
        let unit = [];
        let value = [];

        data.forEach((d) => {
          if (d.parameter === parameters[i]){
            location.push(d.location)
            date.push(d.date.utc)
            lat.push(d.coordinates.latitude)
            lon.push(d.coordinates.longitude)
            parameter.push(d.parameter)
            value.push(d.value)
            unit.push(d.unit)

          }
        })
        plotData.push(
          {
            'name': parameters[i],
            'type': 'scattermapbox',
            'text': location,
            'location': location,
            'time': date,
            'lat': lat,
            'lon': lon,
            'value': value,
            'unit': unit,
            'markers': {
              size: 12,
              color: colors[i],
              opacity: 0.7
            }
          }
        )
      }

      return plotData
    }

    


  
    render() {

      var layout = {
          title: 'German cities environment measurements',
          font: {
            color: 'white'
          },
          width: document.body.clientWidth/1.2,
          height: document.body.clientHeight/1.2,
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
          {console.log(this.transformData(this.state.dataFromApi))}
          <Plot 
            data = {this.transformData(this.state.dataFromApi)}
            layout = {layout}
            config={{mapboxAccessToken: 'pk.eyJ1IjoidmFuZHVuZ2RvIiwiYSI6ImNsMW5yZ2I3YzBzbW0zY3FyNWNnbXQ3ZnkifQ.WqALjHnOnwCvEWSXhXGumQ'}}
          />  
        </div>
      );
    }
}
   
export default Map;