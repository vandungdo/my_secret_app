import React from "react";
import Plot from 'react-plotly.js';

class Map2 extends React.Component {
   
    // Constructor 
    constructor(props) {
        super(props);
   
        this.state = {
            dataFromApi: [],
            dataFromApiisLoaded: false
        };

    }
    
    componentDidMount() {

      const apiEndpoint = "https://docs.openaq.org/v2/measurements?date_from=2000-01-01T00%3A00%3A00%2B00%3A00&     date_to=2022-04-08T13%3A46%3A00%2B00%3A00&limit=20000&page=1&offset=0&sort=desc&radius=1000&country_id=DE&order_by=datetime";
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
      const param = "pm25"
      const color = 'red'

      let plotData = []

      let location = [];
      let date = [];
      let lat = [];
      let lon = [];
      let parameter = [];
      let unit = [];
      let value = [];
      let hoverInfor = [];
      let size = [];

      data.forEach((d) => {
        if (d.parameter === param){
          location.push(d.location)
          date.push(d.date.utc)
          lat.push(d.coordinates.latitude)
          lon.push(d.coordinates.longitude)
          parameter.push(d.parameter)
          value.push(d.value)
          unit.push(d.unit)
          hoverInfor.push(d.location + " - " + d.date.utc)
          size.push(d.value)

        }
      })
      plotData.push(
        {
          'name': 'air particulate pollutant &#8804; 2.5 microns [µg/m³]',
          'type': 'scattermapbox',
          'text': hoverInfor,
          'location': location,
          'size': size,
          'time': date,
          'lat': lat,
          'lon': lon,
          'value': value,
          'unit': unit,
          'opacity': 0.5,
          hovertemplate:
          "<b>%{text}</b><br>" +
          "lat: %{lat}<br>" +
          "lon: %{lon}<br>" +
          "value: %{marker.size}" +
          "<extra></extra>"
          ,
          'marker': {
            size: size,
            color: color,
          }
        }
      )
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
          opacity: 0.7,
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
   
export default Map2;